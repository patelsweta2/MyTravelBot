import express from "express";
import { signUpUser } from "../controllers/user.js";

const router = express.Router();
router.post("/register", signUpUser)

export default router;