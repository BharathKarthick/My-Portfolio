import express from "express";
import AboutModel from "../models/About.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

router.get("/", async (_req, res) => {
  try {
    const about = await AboutModel.findOne().lean();
    res.json({ success: true, about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch about data" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { name, title, image, paragraphs, infoCards } = req.body ?? {};

    let about = await AboutModel.findOne();

    const payload = {
      name: name || "P. Bharath",
      title: title || "Full Stack Developer",
      image: image || about?.image || "",
      paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
      infoCards: Array.isArray(infoCards) ? infoCards : [],
    };

    if (!about) {
      about = await AboutModel.create(payload);
    } else {
      about = await AboutModel.findOneAndUpdate({}, { $set: payload }, { new: true, runValidators: true });
    }

    res.json({ success: true, about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to update about data" });
  }
});

export default router;