import { Request, Response, NextFunction } from "express";
import { CreateGroupSchema, AddMemberSchema } from "@ethioequb/shared";
import { GroupService } from "../services/group.service";
import { ReportService } from "../services/report.service";
import { prisma } from "../config/db";

export class GroupController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = CreateGroupSchema.parse(req.body);
      const group = await GroupService.createGroup(
        req.user!.id,
        input,
        req.ip,
        req.get("user-agent")
      );

      return res.status(201).json({
        success: true,
        data: {
          group: {
            ...group,
            contributionAmount: group.contributionAmount.toString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUserGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const memberships = await prisma.membership.findMany({
        where: { userId: req.user!.id },
        include: {
          group: {
            include: {
              _count: { select: { memberships: true } },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        data: {
          groups: memberships.map((m) => ({
            membershipId: m.id,
            roleInGroup: m.roleInGroup,
            payoutPosition: m.payoutPosition,
            group: {
              ...m.group,
              contributionAmount: m.group.contributionAmount.toString(),
              memberCount: m.group._count.memberships,
            },
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await GroupService.getGroupSummary(req.params.id);

      return res.status(200).json({
        success: true,
        data: {
          group: {
            ...summary.group,
            contributionAmount: summary.group.contributionAmount.toString(),
            cycles: summary.group.cycles.map((c) => ({
              ...c,
              contributions: c.contributions.map((ct) => ({
                ...ct,
                amount: ct.amount.toString(),
              })),
              payout: c.payout
                ? {
                    ...c.payout,
                    amount: c.payout.amount.toString(),
                  }
                : null,
            })),
          },
          stats: summary.stats,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const input = AddMemberSchema.parse(req.body);
      const membership = await GroupService.addMember(
        req.user!.id,
        req.params.id,
        input,
        req.ip,
        req.get("user-agent")
      );

      return res.status(201).json({
        success: true,
        data: { membership },
      });
    } catch (error) {
      next(error);
    }
  }

  static async exportCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await ReportService.generateGroupLedgerCSV(req.params.id);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=ethioequb-ledger-${req.params.id}.csv`
      );
      return res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async getReconciliation(req: Request, res: Response, next: NextFunction) {
    try {
      const reconciliation = await ReportService.getGroupReconciliation(req.params.id);

      return res.status(200).json({
        success: true,
        data: { reconciliation },
      });
    } catch (error) {
      next(error);
    }
  }
}
