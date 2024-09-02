import express from "express";
import {
  registerUser,
  handleLogin,
  addUser,
} from "../controllers/userController";
import { checkIsAdmin } from "../middleware/auth";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(handleLogin);
router.route("/users").post(checkIsAdmin, addUser);

module.exports = router;
