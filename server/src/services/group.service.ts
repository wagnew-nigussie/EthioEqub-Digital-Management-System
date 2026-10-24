import { prisma } from "../config/db";
import { CreateGroupInput, AddMemberInput, GroupFrequency, GroupRole, GroupStatus, CycleStatus, PayoutRule, toMinorUnits } from "@ethioequb/shared";
import { BusinessRuleViolationError, NotFoundError } from "../utils/errors";
import { logAuditAction } from "./audit.service";

/**
 * Calculates sequential cycle due dates and payout dates based on frequency.
 */
export function calculateCycleSchedule(startDateStr: string, totalCycles: number, frequency: GroupFrequency) {
  const cycles: Array<{ cycleNumber: number; dueDate: Date; payoutDate: Date }> = [];
  const baseDate = new Date(startDateStr);

  for (let i = 1; i <= totalCycles; i++) {
    const dueDate = new Date(baseDate);

    if (frequency === GroupFrequency.DAILY) {
      dueDate.setDate(dueDate.getDate() + (i - 1));
    } else if (frequency === GroupFrequency.WEEKLY) {
      dueDate.setDate(dueDate.getDate() + (i - 1) * 7);
    } else if (frequency === GroupFrequency.MONTHLY) {
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
    }

    // Payout date is typically the same day or 1 day after collection deadline
    const payoutDate = new Date(dueDate);

    cycles.push({
      cycleNumber: i,
      dueDate,
      payoutDate,
    });
  }

  return cycles;
}

export class GroupService {
  /**
   * Creates an Equb Group and atomically provisions all cycles (FR-002, FR-003).
   */
  static async createGroup(ownerId: string, input: CreateGroupInput, ipAddress?: string, userAgent?: string) {
    const contributionAmountMinor = BigInt(toMinorUnits(input.contributionAmountETB));
    const cycleSchedules = calculateCycleSchedule(input.startDate, input.totalCycles, input.frequency);

    return await prisma.$transaction(async (tx) => {
      // 1. Create Equb Group
      const group = await tx.equbGroup.create({
        data: {
          ownerId,
          name: input.name,
          description: input.description,
          contributionAmount: contributionAmountMinor,
          currency: input.currency || "ETB",
          frequency: input.frequency,
          totalCycles: input.totalCycles,
          payoutRule: input.payoutRule || PayoutRule.JOIN_ORDER,
          requireGuarantor: input.requireGuarantor || false,
          allowSingleApproverIfSmall: input.allowSingleApproverIfSmall ?? true,
          status: GroupStatus.ACTIVE,
          startDate: new Date(input.startDate),
        },
      });

      // 2. Add creator as Group Owner membership
      const ownerMembership = await tx.membership.create({
        data: {
          userId: ownerId,
          groupId: group.id,
          roleInGroup: GroupRole.OWNER,
          payoutPosition: 1,
        },
      });

      // 3. Provision all cycles
      for (const cs of cycleSchedules) {
        const cycle = await tx.cycle.create({
          data: {
            groupId: group.id,
            cycleNumber: cs.cycleNumber,
            dueDate: cs.dueDate,
            payoutDate: cs.payoutDate,
            status: cs.cycleNumber === 1 ? CycleStatus.OPEN : CycleStatus.PENDING,
          },
        });

        // Initialize scheduled payout slot
        await tx.payout.create({
          data: {
            cycleId: cycle.id,
            recipientId: ownerMembership.id, // placeholder until assigned
            amount: BigInt(Number(contributionAmountMinor) * input.totalCycles),
          },
        });
      }

      // 4. Audit Log
      await logAuditAction({
        actorId: ownerId,
        entityType: "EqubGroup",
        entityId: group.id,
        action: "CREATE_GROUP",
        afterState: group,
        ipAddress,
        userAgent,
        tx,
      });

      return group;
    });
  }

  /**
   * Enrolls a member into an Equb group with role and optional guarantor.
   */
  static async addMember(actorId: string, groupId: string, input: AddMemberInput, ipAddress?: string, userAgent?: string) {
    const group = await prisma.equbGroup.findUnique({
      where: { id: groupId },
      include: { memberships: true },
    });

    if (!group) throw new NotFoundError("Equb group not found");
    if (group.status !== GroupStatus.ACTIVE) throw new BusinessRuleViolationError("Cannot add members to an inactive group");

    // BR-002: Member count cannot exceed planned cycles
    if (group.memberships.length >= group.totalCycles) {
      throw new BusinessRuleViolationError(`Group membership is full (maximum ${group.totalCycles} members)`);
    }

    return await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.create({
        data: {
          userId: input.userId,
          groupId,
          roleInGroup: input.roleInGroup || GroupRole.MEMBER,
          payoutPosition: input.payoutPosition || group.memberships.length + 1,
          guarantorName: input.guarantorName,
          guarantorPhone: input.guarantorPhone,
        },
        include: { user: { select: { fullName: true, email: true, phone: true } } },
      });

      await logAuditAction({
        actorId,
        entityType: "Membership",
        entityId: membership.id,
        action: "ADD_MEMBER",
        afterState: membership,
        ipAddress,
        userAgent,
        tx,
      });

      return membership;
    });
  }

  /**
   * Retrieves group overview, active cycle, and aggregated financial statistics.
   */
  static async getGroupSummary(groupId: string) {
    const group = await prisma.equbGroup.findUnique({
      where: { id: groupId },
      include: {
        owner: { select: { id: true, fullName: true, email: true, phone: true } },
        memberships: {
          include: {
            user: { select: { id: true, fullName: true, email: true, phone: true } },
          },
          orderBy: { payoutPosition: "asc" },
        },
        cycles: {
          include: {
            payout: {
              include: {
                recipient: { include: { user: { select: { fullName: true } } } },
              },
            },
            contributions: true,
          },
          orderBy: { cycleNumber: "asc" },
        },
      },
    });

    if (!group) throw new NotFoundError("Equb group not found");

    // Calculate Financial Aggregates
    let totalCollectedMinor = BigInt(0);
    let totalDisbursedMinor = BigInt(0);

    for (const cycle of group.cycles) {
      for (const cont of cycle.contributions) {
        if (cont.status === "PAID" || cont.status === "PARTIAL") {
          totalCollectedMinor += cont.amount;
        }
      }
      if (cycle.payout && cycle.payout.status === "DISBURSED") {
        totalDisbursedMinor += cycle.payout.amount;
      }
    }

    const currentCycle = group.cycles.find((c) => c.status === CycleStatus.OPEN) || group.cycles[0];

    return {
      group,
      stats: {
        totalCollectedMinor: totalCollectedMinor.toString(),
        totalDisbursedMinor: totalDisbursedMinor.toString(),
        netPoolBalanceMinor: (totalCollectedMinor - totalDisbursedMinor).toString(),
        memberCount: group.memberships.length,
        totalCycles: group.totalCycles,
        currentCycleNumber: currentCycle?.cycleNumber || 1,
        frequency: group.frequency,
      },
    };
  }
}
