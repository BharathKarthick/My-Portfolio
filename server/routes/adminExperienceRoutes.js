import express from "express";
import mongoose from "mongoose";
import ExperienceModel from "../models/Experience.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const experiences = await ExperienceModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, count: experiences.length, experiences });
  } catch {
    res.status(500).json({ success: false, message: "Unable to fetch experiences" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { company, period, role, type, skills, highlights, order } =
      req.body ?? {};

    if (
      typeof company !== "string" ||
      typeof period !== "string" ||
      typeof role !== "string" ||
      !company.trim() ||
      !period.trim() ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company, period and role are required",
      });
    }

    const experience = await ExperienceModel.create({
      company: company.trim(),
      period: period.trim(),
      role: role.trim(),
      type: typeof type === "string" && type.trim() ? type.trim() : "Intern",
      skills: Array.isArray(skills)
        ? skills.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
        : [],
      highlights: Array.isArray(highlights)
        ? highlights.filter((h) => typeof h === "string" && h.trim()).map((h) => h.trim())
        : [],
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    res.status(201).json({ success: true, experience });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to create experience",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid experience ID" });
    }

    const { company, period, role, type, skills, highlights, order } =
      req.body ?? {};

    const updatePayload = {};
    if (typeof company === "string" && company.trim()) updatePayload.company = company.trim();
    if (typeof period === "string" && period.trim()) updatePayload.period = period.trim();
    if (typeof role === "string" && role.trim()) updatePayload.role = role.trim();
    if (typeof type === "string" && type.trim()) updatePayload.type = type.trim();
    if (Array.isArray(skills)) {
      updatePayload.skills = skills
        .filter((s) => typeof s === "string" && s.trim())
        .map((s) => s.trim());
    }
    if (Array.isArray(highlights)) {
      updatePayload.highlights = highlights
        .filter((h) => typeof h === "string" && h.trim())
        .map((h) => h.trim());
    }
    if (order !== undefined && Number.isFinite(Number(order))) {
      updatePayload.order = Number(order);
    }

    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }
    res.json({ success: true, experience });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to update experience",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid experience ID" });
    }

    const experience = await ExperienceModel.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }
    res.json({ success: true, message: "Experience deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Unable to delete experience" });
  }
});

export default router;