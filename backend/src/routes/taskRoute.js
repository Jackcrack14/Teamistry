import express from "express";
import { addTask, editTask, deleteTask } from "../controllers/taskController";

const router = express.Router();

router.route("/projects/task").get();
router.route("/projects/task").post(addTask);
router.route("/projects/task/:id").put(editTask);
router.route("/projects/task/:id").delete(deleteTask);

module.exports = router;
