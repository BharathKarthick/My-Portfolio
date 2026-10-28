import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch projects" });
  }
});

export default router;