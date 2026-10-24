import { prisma } from "../config/db";
import {
  RecordContributionInput,
  CreateAdjustmentInput,
  PaymentMethod,
  ContributionStatus,
  toMinorUnits,
} from "@ethioequb/shared";
import {
  ConflictError,
  NotFoundError,
  BusinessRuleViolationError,
} from "../utils/errors";
import { logAuditAction } from "./audit.service";

export class ContributionService {
  /**
   * Records a member contribution with mandatory reference validation and atomic audit trail (FR-005, BR-004, BR-005, BR-006).
   */
  static async recordContribution(
    actorId: string,
    input: RecordContributionInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const amountMinor = BigInt(toMinorUnits(input.amountETB));

    // 1. Verify membership and cycle
    const membership = await prisma.membership.findUnique({
      where: { id: input.membershipId },
      include: { group: true, user: true },
    });
    if (!membership) throw new NotFoundError("Membership not found");

    if (membership.group.status !== "ACTIVE") {
      throw new BusinessRuleViolationError("Cannot record contribution on a frozen or closed Equb group");
    }

    const cycle = await prisma.cycle.findUnique({
      where: { id: input.cycleId },
    });
    if (!cycle) throw new NotFoundError("Cycle not found");
    if (cycle.groupId !== membership.groupId) {
      throw new BusinessRuleViolationError("Cycle does not belong to the member's Equb group");
    }

    // 2. BR-004 & BR-005: Electronic payments require a reference number and must be unique within group
    if (
      [PaymentMethod.TELEBIRR, PaymentMethod.CBE_BIRR, PaymentMethod.BANK_TRANSFER].includes(input.paymentMethod)
    ) {
      if (!input.referenceNumber || input.referenceNumber.trim() === "") {
        throw new BusinessRuleViolationError(
          `Electronic payment method (${input.paymentMethod}) requires a transaction reference number`
        );
      }

      // Check duplicate reference in the group
      const duplicate = await prisma.contribution.findFirst({
        where: {
          referenceNumber: input.referenceNumber.trim(),
          cycle: { groupId: membership.groupId },
        },
      });

      if (duplicate) {
        throw new ConflictError(
          `Transaction reference '${input.referenceNumber}' has already been recorded in this Equb group`
        );
      }
    }

    // 3. Atomic Database Write & Audit Logging (BR-006, BR-012)
    return await prisma.$transaction(async (tx: any) => {
      const contribution = await tx.contribution.create({
        data: {
          membershipId: input.membershipId,
          cycleId: input.cycleId,
          amount: amountMinor,
          paymentMethod: input.paymentMethod,
          referenceNumber: input.referenceNumber ? input.referenceNumber.trim() : null,
          status: ContributionStatus.PAID,
          note: input.note,
          recordedById: actorId,
        },
        include: {
          membership: { include: { user: { select: { fullName: true, email: true } } } },
          cycle: true,
        },
      });

      await logAuditAction({
        actorId,
        entityType: "Contribution",
        entityId: contribution.id,
        action: "RECORD_CONTRIBUTION",
        afterState: {
          ...contribution,
          amount: contribution.amount.toString(),
        },
        ipAddress,
        userAgent,
        tx,
      });

      return contribution;
    });
  }

  /**
   * Applies an adjustment to an existing contribution record without hard deletion (BR-006).
   */
  static async createAdjustment(
    actorId: string,
    input: CreateAdjustmentInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const deltaMinor = BigInt(toMinorUnits(input.amountDeltaETB));

    const contribution = await prisma.contribution.findUnique({
      where: { id: input.contributionId },
      include: { adjustments: true, membership: { include: { group: true } } },
    });

    if (!contribution) throw new NotFoundError("Contribution record not found");
    if (contribution.membership.group.status !== "ACTIVE") {
      throw new BusinessRuleViolationError("Cannot adjust records of an inactive Equb group");
    }

    return await prisma.$transaction(async (tx: any) => {
      const adjustment = await tx.adjustment.create({
        data: {
          contributionId: input.contributionId,
          amountDelta: deltaMinor,
          reason: input.reason,
          createdById: actorId,
        },
      });

      // Update parent contribution status to ADJUSTED
      await tx.contribution.update({
        where: { id: input.contributionId },
        data: { status: ContributionStatus.ADJUSTED },
      });

      await logAuditAction({
        actorId,
        entityType: "Adjustment",
        entityId: adjustment.id,
        action: "CREATE_ADJUSTMENT",
        beforeState: { originalAmount: contribution.amount.toString() },
        afterState: {
          adjustmentId: adjustment.id,
          amountDelta: deltaMinor.toString(),
          reason: input.reason,
        },
        ipAddress,
        userAgent,
        tx,
      });

      return adjustment;
    });
  }

  /**
   * Computes a member's comprehensive balance standing across all cycles in an Equb group.
   */
  static async getMemberBalance(membershipId: string) {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: {
        group: {
          include: {
            cycles: { orderBy: { cycleNumber: "asc" } },
          },
        },
        contributions: {
          include: { adjustments: true },
        },
      },
    });

    if (!membership) throw new NotFoundError("Membership not found");

    const expectedPerCycle = membership.group.contributionAmount;
    const pastAndCurrentCycles = membership.group.cycles.filter(
      (c: any) => c.status === "OPEN" || c.status === "RECONCILED" || c.status === "CLOSED"
    );

    const totalExpectedSoFar = BigInt(pastAndCurrentCycles.length) * expectedPerCycle;

    let totalPaidMinor = BigInt(0);
    for (const cont of membership.contributions) {
      totalPaidMinor += cont.amount;
      for (const adj of cont.adjustments) {
        totalPaidMinor += adj.amountDelta;
      }
    }

    const netBalanceMinor = totalPaidMinor - totalExpectedSoFar;

    return {
      membershipId,
      groupName: membership.group.name,
      cyclesElapsed: pastAndCurrentCycles.length,
      expectedPerCycleMinor: expectedPerCycle.toString(),
      totalExpectedSoFarMinor: totalExpectedSoFar.toString(),
      totalPaidMinor: totalPaidMinor.toString(),
      netBalanceMinor: netBalanceMinor.toString(),
      isDelinquent: netBalanceMinor < BigInt(0),
      arrearsMinor: netBalanceMinor < BigInt(0) ? (-netBalanceMinor).toString() : "0",
    };
  }
}
