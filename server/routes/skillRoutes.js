import express from "express";
import SkillModel from "../models/Skill.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const skills = await SkillModel.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch skills" });
  }
});

export default router;