import express from "express";
import AboutModel from "../models/About.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    // About என்பது பொதுவாக ஒரு சிங்கிள் டாக்குமென்டாக (Single Profile) இருக்கும்
    const about = await AboutModel.findOne().lean();
    res.json({ success: true, about });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch about data" });
  }
});

export default router;