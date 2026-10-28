import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PDF_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (
      !allowedTypes.includes(file.mimetype) &&
      file.mimetype !== "application/pdf"
    ) {
      return callback(
        new Error("Only JPG, PNG, WebP images and PDF files are allowed")
      );
    }

    callback(null, true);
  },
});

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

router.use(requireAdmin);

// 1. Project Image Upload API
router.post("/project-image", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid upload",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Select an image to upload",
      });
    }

    if (req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Images must be 5 MB or smaller",
      });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "portfolio/projects",
        public_id: randomUUID(),
        overwrite: false,
      });

      res.status(201).json({
        success: true,
        message: "Project image uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (uploadError) {
      console.error("Project image upload failed:", uploadError.message);
      res.status(502).json({
        success: false,
        message: "Unable to upload project image",
      });
    }
  });
});

// 2. Resume PDF Upload API
router.post("/resume", (req, res) => {
  upload.single("resume")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid upload",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Select a PDF resume to upload",
      });
    }

    if (
      req.file.mimetype !== "application/pdf" ||
      !req.file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return res.status(400).json({
        success: false,
        message: "Resume must be a PDF file",
      });
    }

    try {
      // resource_type
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image", 
        folder: "portfolio/resume",
        public_id: "Bharath_Resume",
        overwrite: true,
      });

      res.status(201).json({
        success: true,
        message: "Resume uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (uploadError) {
      console.error("Resume upload failed:", uploadError.message);
      res.status(502).json({
        success: false,
        message: "Unable to upload resume",
      });
    }
  });
});

// 3. About Profile Image Upload API
router.post("/about-image", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid upload",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Select a profile image to upload",
      });
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Profile image must be JPG, PNG, or WebP",
      });
    }

    if (req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Images must be 5 MB or smaller",
      });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "portfolio/about",
        public_id: randomUUID(),
        overwrite: false,
      });

      return res.status(201).json({
        success: true,
        message: "About profile image uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (uploadError) {
      console.error("About image upload failed:", uploadError.message);
      return res.status(502).json({
        success: false,
        message: "Unable to upload About profile image",
      });
    }
  });
});

export default router;