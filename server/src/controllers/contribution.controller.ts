import { Request, Response, NextFunction } from "express";
import { RecordContributionSchema, CreateAdjustmentSchema } from "@ethioequb/shared";
import { ContributionService } from "../services/contribution.service";

export class ContributionController {
  static async record(req: Request, res: Response, next: NextFunction) {
    try {
      const input = RecordContributionSchema.parse(req.body);
      const contribution = await ContributionService.recordContribution(
        req.user!.id,
        input,
        req.ip,
        req.get("user-agent")
      );

      return res.status(201).json({
        success: true,
        data: {
          contribution: {
            ...contribution,
            amount: contribution.amount.toString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const input = CreateAdjustmentSchema.parse(req.body);
      const adjustment = await ContributionService.createAdjustment(
        req.user!.id,
        input,
        req.ip,
        req.get("user-agent")
      );

      return res.status(201).json({
        success: true,
        data: {
          adjustment: {
            ...adjustment,
            amountDelta: adjustment.amountDelta.toString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const balance = await ContributionService.getMemberBalance(req.params.membershipId);

      return res.status(200).json({
        success: true,
        data: { balance },
      });
    } catch (error) {
      next(error);
    }
  }
}
