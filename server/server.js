import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dns from "node:dns";

import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import adminAboutRoutes from "./routes/adminAboutRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import adminSkillRoutes from "./routes/adminSkillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import adminExperienceRoutes from "./routes/adminExperienceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminProjectRoutes from "./routes/adminProjectRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. மிக முக்கியமானது: CORS மற்றும் JSON Parser-ஐ முதலில் வைக்க வேண்டும்
// CORS Configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://pbharathportfolio.netlify.app"
    ],
    credentials: true, // Cookies or headers anuppum pothu ithu thevai padum
  })
);

app.use(express.json({ limit: "1mb" }));

// 2. அதன்பிறகு அனைத்து API Routes-ஐயும் இணைக்க வேண்டும்
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/admin/about", adminAboutRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin/skills", adminSkillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/admin/experiences", adminExperienceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin/projects", adminProjectRoutes);

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Bharath Portfolio backend is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Portfolio backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();