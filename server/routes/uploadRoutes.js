import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { rateLimit } from "express-rate-limit";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

// Upload-க்கென பிரத்யேக Rate Limiter (15 நிமிடத்தில் அதிகபட்சம் 20 uploads)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many upload requests. Please try again later.",
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PDF_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, WebP images and PDF files are allowed")
      );
    }

    callback(null, true);
  },
});

// Magic Bytes (Binary Signature) சரிபார்ப்பு - போலி ஃபைல்களைத் தடுக்க
function isValidImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  const isJpeg =
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  // WebP: "RIFF" (0..3) and "WEBP" (8..11)
  const isWebp =
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";

  return isJpeg || isPng || isWebp;
}

function isValidPdfBuffer(buffer) {
  if (!buffer || buffer.length < 5) return false;
  // PDF: "%PDF-" (25 50 44 46 2D)
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

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
router.use(uploadLimiter);

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

    if (!isValidImageBuffer(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or corrupted image file signature",
      });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "portfolio/projects",
        public_id: randomUUID(),
        overwrite: false,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
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
      !req.file.originalname.toLowerCase().endsWith(".pdf") ||
      !isValidPdfBuffer(req.file.buffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Resume must be a valid PDF file",
      });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "portfolio/resume",
        public_id: "Bharath_Resume",
        overwrite: true,
        allowed_formats: ["pdf"],
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

    if (req.file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Images must be 5 MB or smaller",
      });
    }

    if (!isValidImageBuffer(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or corrupted image file signature",
      });
    }

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: "image",
        folder: "portfolio/about",
        public_id: randomUUID(),
        overwrite: false,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
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