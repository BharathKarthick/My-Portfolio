import express from "express";
import ExperienceModel from "../models/Experience.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const experiences = await ExperienceModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, count: experiences.length, experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch experiences" });
  }
});

export default router;