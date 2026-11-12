import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

// பாதுகாப்பான HTTP/HTTPS URL-களை மட்டும் அனுமதிக்கும் ஃபங்ஷன் (XSS தடுப்பு)
function isSafeHttpUrl(url) {
  if (!url) return true; // Optional URLs-க்கு அனுமதி உண்டு
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: projects.length, projects });
  } catch {
    res.status(500).json({ success: false, message: "Unable to fetch projects" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      imagePublicId,
      technologies,
      liveUrl,
      frontendUrl,
      published,
      order,
    } = req.body ?? {};

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof image !== "string" ||
      !title.trim() ||
      !description.trim() ||
      !image.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description and image are required",
      });
    }

    if (
      !isSafeHttpUrl(image) ||
      !isSafeHttpUrl(liveUrl) ||
      !isSafeHttpUrl(frontendUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL protocol. Only http and https URLs are allowed.",
      });
    }

    const sanitizedTechnologies = Array.isArray(technologies)
      ? technologies
          .filter((t) => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.trim())
      : [];

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      imagePublicId: typeof imagePublicId === "string" ? imagePublicId.trim() : "",
      technologies: sanitizedTechnologies,
      liveUrl: typeof liveUrl === "string" ? liveUrl.trim() : "",
      frontendUrl: typeof frontendUrl === "string" ? frontendUrl.trim() : "",
      published: typeof published === "boolean" ? published : true,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to create project",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const {
      title,
      description,
      image,
      imagePublicId,
      technologies,
      liveUrl,
      frontendUrl,
      published,
      order,
    } = req.body ?? {};

    const updatePayload = {};

    if (typeof title === "string" && title.trim()) {
      updatePayload.title = title.trim();
    }
    if (typeof description === "string" && description.trim()) {
      updatePayload.description = description.trim();
    }
    if (typeof image === "string" && image.trim()) {
      if (!isSafeHttpUrl(image)) {
        return res.status(400).json({ success: false, message: "Invalid image URL" });
      }
      updatePayload.image = image.trim();
    }
    if (typeof imagePublicId === "string") {
      updatePayload.imagePublicId = imagePublicId.trim();
    }
    if (Array.isArray(technologies)) {
      updatePayload.technologies = technologies
        .filter((t) => typeof t === "string" && t.trim().length > 0)
        .map((t) => t.trim());
    }
    if (liveUrl !== undefined) {
      if (!isSafeHttpUrl(liveUrl)) {
        return res.status(400).json({ success: false, message: "Invalid live URL" });
      }
      updatePayload.liveUrl = typeof liveUrl === "string" ? liveUrl.trim() : "";
    }
    if (frontendUrl !== undefined) {
      if (!isSafeHttpUrl(frontendUrl)) {
        return res.status(400).json({ success: false, message: "Invalid GitHub URL" });
      }
      updatePayload.frontendUrl =
        typeof frontendUrl === "string" ? frontendUrl.trim() : "";
    }
    if (typeof published === "boolean") {
      updatePayload.published = published;
    }
    if (order !== undefined && Number.isFinite(Number(order))) {
      updatePayload.order = Number(order);
    }

    // புது image அப்லோட் செய்திருந்தால், Cloudinary-ல் உள்ள பழைய image-ஐ டெலீட் செய்தல்
    if (
      existing.imagePublicId &&
      updatePayload.imagePublicId &&
      existing.imagePublicId !== updatePayload.imagePublicId
    ) {
      await cloudinary.uploader.destroy(existing.imagePublicId).catch(() => {});
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true }
    );

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to update project",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Cloudinary-ல் இருந்தும் இமேஜை டெலீட் செய்தல்
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Unable to delete project" });
  }
});

export default router;