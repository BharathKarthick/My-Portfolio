import express from "express";
import mongoose from "mongoose";
import SkillModel from "../models/Skill.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

router.get("/", async (_req, res) => {
  try {
    const skills = await SkillModel.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: skills.length, skills });
  } catch {
    res.status(500).json({ success: false, message: "Unable to fetch skills" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, key, color, order } = req.body ?? {};
    if (
      typeof name !== "string" ||
      typeof key !== "string" ||
      typeof color !== "string" ||
      !name.trim() ||
      !key.trim() ||
      !color.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, key, and color are required",
      });
    }

    const cleanColor = color.trim();
    if (!HEX_COLOR_REGEX.test(cleanColor)) {
      return res.status(400).json({
        success: false,
        message: "Color must be a valid 6-digit hex code (e.g. #FF5C00)",
      });
    }

    const skill = await SkillModel.create({
      name: name.trim(),
      key: key.trim().toLowerCase(),
      color: cleanColor,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to create skill",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid skill ID" });
    }

    const { name, key, color, order } = req.body ?? {};
    const updatePayload = {};

    if (typeof name === "string" && name.trim()) updatePayload.name = name.trim();
    if (typeof key === "string" && key.trim()) updatePayload.key = key.trim().toLowerCase();
    if (typeof color === "string" && color.trim()) {
      if (!HEX_COLOR_REGEX.test(color.trim())) {
        return res.status(400).json({
          success: false,
          message: "Color must be a valid 6-digit hex code",
        });
      }
      updatePayload.color = color.trim();
    }
    if (order !== undefined && Number.isFinite(Number(order))) {
      updatePayload.order = Number(order);
    }

    const skill = await SkillModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }
    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to update skill",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid skill ID" });
    }

    const skill = await SkillModel.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }
    res.json({ success: true, message: "Skill deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Unable to delete skill" });
  }
});

export default router;