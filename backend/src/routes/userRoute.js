import express from "express";
import { registerUser, handleLogin } from "../controllers/userController";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(handleLogin);
