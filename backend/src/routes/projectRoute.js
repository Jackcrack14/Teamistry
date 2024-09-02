import express from "express";
import { checkIsAdminOrManager } from "../middleware/auth";
import { addProject, deleteProject } from "../controllers//projectController";
const router = express.Router();

router.route("/project").post(checkIsAdminOrManager, addProject);
router.route("/project/:id").delete(checkIsAdminOrManager, deleteProject);

module.exports = router;
