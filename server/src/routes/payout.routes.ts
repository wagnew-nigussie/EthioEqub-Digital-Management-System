import { Router } from "express";
import { PayoutController } from "../controllers/payout.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/:id/approve", PayoutController.approve);

export default router;
