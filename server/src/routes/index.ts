import { Router } from "express";
import authRoutes from "./auth.routes";
import groupRoutes from "./group.routes";
import contributionRoutes from "./contribution.routes";
import payoutRoutes from "./payout.routes";
import auditRoutes from "./audit.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/groups", groupRoutes);
router.use("/contributions", contributionRoutes);
router.use("/payouts", payoutRoutes);
router.use("/audit-logs", auditRoutes);

export default router;
