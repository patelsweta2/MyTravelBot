import TryCatch from "../middlewares/tryCatch.js";
import sanitize from "mongo-sanitize";
import { signUpSchema } from "./../config/zod.js";
import { redisClient } from "../server.js";
import { User } from "../models/users.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/smtp.js";
import { getVerifyEmailHtml } from "../config/html.js";

export const signUpUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = signUpSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allErrors,
    });
  }
  const { name, email, password } = validation.data;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many request, try again later",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const datatoStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
  });
  await redisClient.set(verifyKey, datatoStore, { EX: 300 });
  const subject = "Verify your email for Account Creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });
  res.json({
    message:
      "If your email is valid, a verification like has been sent. it will expire in 5 minutes",
  });
});
