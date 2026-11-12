import express from "express";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 15 நிமிடத்தில் 5 தவறான முயற்சிகளுக்கு மேல் செய்தால் IP பிளாக் ஆகும்
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true, // சரியாக லாகின் செய்தால் கவுண்ட் ஆகாது
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many failed login attempts. Please try again in 15 minutes.",
  },
});

// Timing-Safe String Comparison (Response time வைத்து username கணிப்பதைத் தடுக்க)
function safeCompare(input, expected) {
  const inputBuf = Buffer.from(String(input));
  const expectedBuf = Buffer.from(String(expected));
  if (inputBuf.length !== expectedBuf.length) {
    // நீளம் மாறினாலும் ஒரே நேரம் எடுக்குமாறு dummy compare செய்வது
    crypto.timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }
  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}

// Dummy hash (Username தவறாக இருந்தாலும் bcrypt நேரத்தைச் சமன் செய்ய)
const DUMMY_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password ||
      username.length > 100 ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid username and password are required",
      });
    }

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const usernameMatches = safeCompare(
      username.trim(),
      process.env.ADMIN_USERNAME
    );

    const passwordMatches = await bcrypt.compare(
      password,
      usernameMatches ? process.env.ADMIN_PASSWORD_HASH : DUMMY_HASH
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "2h",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      expiresIn: 7200,
    });
  } catch (error) {
    console.error("Admin login failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
});

// Admin Session-ஐச் சரியாகச் சரிபார்க்கும் புதிய Endpoint
router.get("/verify", requireAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

export default router;