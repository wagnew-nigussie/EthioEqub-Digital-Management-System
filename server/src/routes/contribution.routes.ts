import { Router } from "express";
import { ContributionController } from "../controllers/contribution.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", ContributionController.record);
router.post("/adjustments", ContributionController.adjust);
router.get("/members/:membershipId/balance", ContributionController.getMemberBalance);

export default router;
