import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: Get resume URL
router.get("/resume", async (_req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: "global" }).lean();
    res.json({
      success: true,
      resumeUrl: settings?.resumeUrl || "",
    });
  } catch (error) {
    console.error("Failed to fetch resume settings:", error.message);
    res.status(500).json({ success: false, message: "Unable to fetch resume settings" });
  }
});

// Admin: Update resume URL
router.put("/admin/resume", requireAdmin, async (req, res) => {
  try {
    const { resumeUrl, resumePublicId } = req.body;
    if (
      typeof resumeUrl !== "string" ||
      !resumeUrl.startsWith("https://res.cloudinary.com/") ||
      typeof resumePublicId !== "string" ||
      !resumePublicId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid Cloudinary resume URL and public ID are required",
      });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          resumeUrl: resumeUrl.trim(),
          resumePublicId: resumePublicId.trim(),
        },
        $setOnInsert: { key: "global" },
      },
      { returnDocument: "after", upsert: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Resume settings updated successfully",
      resumeUrl: settings.resumeUrl,
    });
  } catch (error) {
    console.error("Failed to update resume settings:", error.message);
    res.status(500).json({ success: false, message: "Unable to update resume settings" });
  }
});

// Public: Get Home settings
router.get("/home", async (_req, res) => {
  try {
    const settings = await SiteSettings.findOne({ key: "global" }).lean();
    const defaults = {
      roleTitles: ["UI/UX Designer", "Web Developer", "Front-End Engineer"],
      location: "Chennai, Tamil Nadu, India",
      experienceYears: 2,
      terminalName: "P. Bharath",
    };

    const savedHome = settings?.home || {};

    res.json({
      success: true,
      home: {
        roleTitles:
          Array.isArray(savedHome.roleTitles) && savedHome.roleTitles.length > 0
            ? savedHome.roleTitles
            : defaults.roleTitles,
        location: savedHome.location ?? defaults.location,
        experienceYears: savedHome.experienceYears ?? defaults.experienceYears,
        terminalName: savedHome.terminalName ?? defaults.terminalName,
      },
    });
  } catch (error) {
    console.error("Failed to fetch Home settings:", error.message);
    res.status(500).json({ success: false, message: "Unable to fetch Home settings" });
  }
});

// Admin: Update Home settings
router.put("/admin/home", requireAdmin, async (req, res) => {
  try {
    const { roleTitles, location, experienceYears, terminalName } = req.body ?? {};

    if (!Array.isArray(roleTitles) || roleTitles.length === 0) {
      return res.status(400).json({ success: false, message: "At least one role title is required" });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          "home.roleTitles": roleTitles.map((t) => t.trim()),
          "home.location": (location || "Chennai, Tamil Nadu, India").trim(),
          "home.experienceYears": Number(experienceYears) || 0,
          "home.terminalName": terminalName.trim(),
        },
        $setOnInsert: { key: "global" },
      },
      { upsert: true, returnDocument: "after", runValidators: true },
    );

    res.json({
      success: true,
      message: "Home settings updated successfully",
      home: settings.home,
    });
  } catch (error) {
    console.error("Failed to update Home settings:", error.message);
    res.status(500).json({ success: false, message: "Unable to update Home settings" });
  }
});

export default router;