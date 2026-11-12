import express from "express";
import AboutModel from "../models/About.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

function isSafeHttpUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

router.get("/", async (_req, res) => {
  try {
    const about = await AboutModel.findOne().lean();
    res.json({ success: true, about });
  } catch {
    res.status(500).json({ success: false, message: "Unable to fetch about data" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { name, title, image, paragraphs, infoCards } = req.body ?? {};

    let about = await AboutModel.findOne();
    const finalImage =
      typeof image === "string" && image.trim()
        ? image.trim()
        : about?.image || "";

    if (finalImage && !isSafeHttpUrl(finalImage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile image URL",
      });
    }

    const sanitizedParagraphs = Array.isArray(paragraphs)
      ? paragraphs
          .filter((p) => typeof p === "string" && p.trim().length > 0)
          .map((p) => p.trim())
      : [];

    const sanitizedInfoCards = Array.isArray(infoCards)
      ? infoCards
          .filter(
            (c) =>
              c &&
              typeof c.label === "string" &&
              typeof c.value === "string" &&
              c.label.trim() &&
              c.value.trim()
          )
          .map((c) => ({
            label: c.label.trim(),
            value: c.value.trim(),
          }))
      : [];

    const payload = {
      name: typeof name === "string" && name.trim() ? name.trim() : "P. Bharath",
      title:
        typeof title === "string" && title.trim()
          ? title.trim()
          : "Full Stack Developer",
      image: finalImage,
      paragraphs: sanitizedParagraphs,
      infoCards: sanitizedInfoCards,
    };

    if (!about) {
      about = await AboutModel.create(payload);
    } else {
      about = await AboutModel.findOneAndUpdate(
        {},
        { $set: payload },
        { new: true, runValidators: true }
      );
    }

    res.json({ success: true, about });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to update about data",
    });
  }
});

export default router;