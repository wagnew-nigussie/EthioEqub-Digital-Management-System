import { prisma } from "../config/db";
import { NotFoundError } from "../utils/errors";
import { formatETB, toMajorUnits } from "@ethioequb/shared";

/**
 * Sanitizes cell values to prevent CSV formula injection (AC-07).
 */
function sanitizeCSVCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value).trim();
  // If the cell begins with formula characters (=, +, -, @), prepend a single quote
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  // Escape double quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export class ReportService {
  /**
   * Generates a sanitized CSV export of the group transaction ledger (FR-010, AC-07).
   */
  static async generateGroupLedgerCSV(groupId: string): Promise<string> {
    const group = await prisma.equbGroup.findUnique({
      where: { id: groupId },
      include: {
        cycles: {
          include: {
            contributions: {
              include: {
                membership: { include: { user: true } },
                adjustments: true,
                recordedBy: true,
              },
            },
          },
          orderBy: { cycleNumber: "asc" },
        },
      },
    });

    if (!group) throw new NotFoundError("Equb group not found");

    const headers = [
      "Cycle Number",
      "Member Name",
      "Phone",
      "Amount (ETB)",
      "Payment Method",
      "Reference Number",
      "Status",
      "Adjustments Total (ETB)",
      "Recorded By",
      "Recorded Date (UTC)",
    ];

    const rows: string[] = [headers.map(sanitizeCSVCell).join(",")];

    for (const cycle of group.cycles) {
      for (const cont of cycle.contributions) {
        let adjTotalMinor = BigInt(0);
        for (const adj of cont.adjustments) {
          adjTotalMinor += adj.amountDelta;
        }

        const row = [
          `#${cycle.cycleNumber}`,
          cont.membership.user.fullName,
          cont.membership.user.phone,
          toMajorUnits(cont.amount).toFixed(2),
          cont.paymentMethod,
          cont.referenceNumber || "N/A",
          cont.status,
          toMajorUnits(adjTotalMinor).toFixed(2),
          cont.recordedBy.fullName,
          cont.recordedAt.toISOString(),
        ];

        rows.push(row.map(sanitizeCSVCell).join(","));
      }
    }

    return rows.join("\n");
  }

  /**
   * Generates a structured financial summary object for PDF statement or dashboard reporting.
   */
  static async getGroupReconciliation(groupId: string) {
    const group = await prisma.equbGroup.findUnique({
      where: { id: groupId },
      include: {
        memberships: { include: { user: true } },
        cycles: {
          include: {
            contributions: { include: { adjustments: true } },
            payout: { include: { recipient: { include: { user: true } } } },
          },
        },
      },
    });

    if (!group) throw new NotFoundError("Equb group not found");

    let totalCollectedMinor = BigInt(0);
    let totalAdjustmentsMinor = BigInt(0);
    let totalDisbursedMinor = BigInt(0);

    for (const cycle of group.cycles) {
      for (const cont of cycle.contributions) {
        totalCollectedMinor += cont.amount;
        for (const adj of cont.adjustments) {
          totalAdjustmentsMinor += adj.amountDelta;
        }
      }

      if (cycle.payout && cycle.payout.status === "DISBURSED") {
        totalDisbursedMinor += cycle.payout.amount;
      }
    }

    const netCollectedMinor = totalCollectedMinor + totalAdjustmentsMinor;
    const poolReserveMinor = netCollectedMinor - totalDisbursedMinor;

    return {
      groupName: group.name,
      currency: group.currency,
      totalCycles: group.totalCycles,
      memberCount: group.memberships.length,
      metrics: {
        totalCollectedFormatted: formatETB(totalCollectedMinor),
        totalAdjustmentsFormatted: formatETB(totalAdjustmentsMinor),
        netCollectedFormatted: formatETB(netCollectedMinor),
        totalDisbursedFormatted: formatETB(totalDisbursedMinor),
        poolReserveFormatted: formatETB(poolReserveMinor),
      },
    };
  }
}
