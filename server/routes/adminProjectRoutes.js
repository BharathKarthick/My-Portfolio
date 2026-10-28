import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch projects" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, image, ...rest } = req.body ?? {};
    if (!title?.trim() || !description?.trim() || !image?.trim()) {
      return res.status(400).json({ success: false, message: "Title, description and image are required" });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      ...rest,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to create project" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    );

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to update project" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete project" });
  }
});

export default router;