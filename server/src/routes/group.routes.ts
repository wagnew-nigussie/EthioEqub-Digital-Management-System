import { Router } from "express";
import { GroupController } from "../controllers/group.controller";
import { requireAuth, requireGroupRole } from "../middleware/auth";
import { GroupRole } from "@ethioequb/shared";

const router = Router();

router.use(requireAuth);

router.post("/", GroupController.create);
router.get("/", GroupController.listUserGroups);
router.get("/:id", requireGroupRole([GroupRole.OWNER, GroupRole.TREASURER, GroupRole.MANAGER, GroupRole.MEMBER]), GroupController.getSummary);
router.post("/:id/members", requireGroupRole([GroupRole.OWNER, GroupRole.MANAGER]), GroupController.addMember);
router.get("/:id/reports/ledger.csv", requireGroupRole([GroupRole.OWNER, GroupRole.TREASURER, GroupRole.MANAGER]), GroupController.exportCSV);
router.get("/:id/reports/reconciliation", requireGroupRole([GroupRole.OWNER, GroupRole.TREASURER, GroupRole.MANAGER]), GroupController.getReconciliation);

export default router;
