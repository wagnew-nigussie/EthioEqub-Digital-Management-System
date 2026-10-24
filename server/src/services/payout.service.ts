import { prisma } from "../config/db";
import { PayoutStatus, CycleStatus } from "@ethioequb/shared";
import {
  NotFoundError,
  BusinessRuleViolationError,
} from "../utils/errors";
import { logAuditAction } from "./audit.service";

export class PayoutService {
  /**
   * Submits a payout approval adhering to Dual-Control Governance (FR-008, BR-007).
   */
  static async approvePayout(
    actorId: string,
    payoutId: string,
    notes?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const payout = await prisma.payout.findUnique({
      where: { id: payoutId },
      include: {
        cycle: {
          include: {
            group: {
              include: { memberships: true },
            },
          },
        },
        recipient: {
          include: { user: true },
        },
      },
    });

    if (!payout) throw new NotFoundError("Payout not found");
    if (payout.status === PayoutStatus.DISBURSED) {
      throw new BusinessRuleViolationError("This payout has already been disbursed");
    }

    const group = payout.cycle.group;
    const isSmallGroup = group.memberships.length < 5;
    const allowsSingleApproval = isSmallGroup && group.allowSingleApproverIfSmall;

    return await prisma.$transaction(async (tx: any) => {
      // CASE 1: Single Approval Permitted for Small Groups (< 5 members)
      if (allowsSingleApproval && payout.status === PayoutStatus.SCHEDULED) {
        const disbursedPayout = await tx.payout.update({
          where: { id: payoutId },
          data: {
            approver1Id: actorId,
            status: PayoutStatus.DISBURSED,
            disbursedAt: new Date(),
            notes: notes || "Disbursed via approved small-group single authorization",
          },
        });

        // Close current cycle and open next cycle
        await tx.cycle.update({
          where: { id: payout.cycleId },
          data: { status: CycleStatus.CLOSED },
        });

        const nextCycle = await tx.cycle.findFirst({
          where: {
            groupId: group.id,
            cycleNumber: payout.cycle.cycleNumber + 1,
          },
        });
        if (nextCycle) {
          await tx.cycle.update({
            where: { id: nextCycle.id },
            data: { status: CycleStatus.OPEN },
          });
        }

        await logAuditAction({
          actorId,
          entityType: "Payout",
          entityId: payout.id,
          action: "DISBURSE_PAYOUT_SINGLE",
          afterState: {
            payoutId: payout.id,
            amount: payout.amount.toString(),
            recipient: payout.recipient.user.fullName,
            disbursedAt: new Date().toISOString(),
          },
          ipAddress,
          userAgent,
          tx,
        });

        return disbursedPayout;
      }

      // CASE 2: Step 1 of Dual Control (Approver 1)
      if (payout.status === PayoutStatus.SCHEDULED) {
        const updatedPayout = await tx.payout.update({
          where: { id: payoutId },
          data: {
            approver1Id: actorId,
            status: PayoutStatus.PENDING_SECOND_APPROVAL,
            notes,
          },
        });

        await logAuditAction({
          actorId,
          entityType: "Payout",
          entityId: payout.id,
          action: "PAYOUT_PRIMARY_APPROVAL",
          afterState: updatedPayout,
          ipAddress,
          userAgent,
          tx,
        });

        return updatedPayout;
      }

      // CASE 3: Step 2 of Dual Control (Approver 2)
      if (payout.status === PayoutStatus.PENDING_SECOND_APPROVAL) {
        // Enforce BR-007: Approver 1 cannot equal Approver 2
        if (payout.approver1Id === actorId) {
          throw new BusinessRuleViolationError(
            "Dual-control violation: Approver 2 must be a different authorized user than Approver 1"
          );
        }

        const disbursedPayout = await tx.payout.update({
          where: { id: payoutId },
          data: {
            approver2Id: actorId,
            status: PayoutStatus.DISBURSED,
            disbursedAt: new Date(),
            notes: notes || payout.notes,
          },
        });

        // Close current cycle and advance
        await tx.cycle.update({
          where: { id: payout.cycleId },
          data: { status: CycleStatus.CLOSED },
        });

        const nextCycle = await tx.cycle.findFirst({
          where: {
            groupId: group.id,
            cycleNumber: payout.cycle.cycleNumber + 1,
          },
        });
        if (nextCycle) {
          await tx.cycle.update({
            where: { id: nextCycle.id },
            data: { status: CycleStatus.OPEN },
          });
        }

        await logAuditAction({
          actorId,
          entityType: "Payout",
          entityId: payout.id,
          action: "DISBURSE_PAYOUT_DUAL",
          afterState: {
            payoutId: payout.id,
            amount: payout.amount.toString(),
            recipient: payout.recipient.user.fullName,
            approver1Id: payout.approver1Id,
            approver2Id: actorId,
            disbursedAt: new Date().toISOString(),
          },
          ipAddress,
          userAgent,
          tx,
        });

        return disbursedPayout;
      }

      throw new BusinessRuleViolationError(`Invalid payout status for approval: ${payout.status}`);
    });
  }
}
