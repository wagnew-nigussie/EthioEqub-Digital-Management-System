import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", AuditController.listLogs);

export default router;
