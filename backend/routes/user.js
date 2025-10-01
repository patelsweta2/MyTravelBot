import express from "express";
import { signUpUser, verifyUser } from "../controllers/user.js";

const router = express.Router();
router.post("/register", signUpUser)
router.post("/verify/:token",verifyUser)

export default router;