import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";
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

// 1. Render போன்ற Reverse Proxy-களில் உண்மையான User IP-ஐக் கண்டறிய
app.set("trust proxy", 1);

// 2. X-Powered-By header-ஐ மறைத்தல்
app.disable("x-powered-by");

// 3. Helmet மூலம் HTTP Security Headers அமைத்தல்
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 4. Strict CORS Configuration
const allowedOrigins = [
  "https://pbharathportfolio.netlify.app",
  process.env.FRONTEND_URL,
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173"] : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 5. Global API Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", globalLimiter);

// 6. Body Parser & Size Limit
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// 7. Express 5 Compatible NoSQL Injection Sanitizer (req.body & req.params-ல் '$' மற்றும் '.' கீகளை நீக்கும்)
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }
}

app.use((req, _res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  next();
});

// 8. HTTP Parameter Pollution தடுப்பு
app.use(hpp());

// 9. API Routes
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

// 10. Global Error Handler
app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy: Access denied",
    });
  }

  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: "Internal server error",
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