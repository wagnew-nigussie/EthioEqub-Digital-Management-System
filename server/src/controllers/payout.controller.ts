import { Request, Response, NextFunction } from "express";
import { ApprovePayoutSchema } from "@ethioequb/shared";
import { PayoutService } from "../services/payout.service";

export class PayoutController {
  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const input = ApprovePayoutSchema.parse(req.body);
      const payout = await PayoutService.approvePayout(
        req.user!.id,
        req.params.id,
        input.notes,
        req.ip,
        req.get("user-agent")
      );

      return res.status(200).json({
        success: true,
        data: {
          payout: {
            ...payout,
            amount: payout.amount.toString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
