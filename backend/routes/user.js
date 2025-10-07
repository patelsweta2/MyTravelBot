import express from "express";
import { loginUser, signUpUser, verifyOtp, verifyUser } from "../controllers/user.js";

const router = express.Router();
router.post("/register", signUpUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify",verifyOtp)

export default router;
