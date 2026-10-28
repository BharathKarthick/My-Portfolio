import mongoose from "mongoose";

const infoCardSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true }, // e.g. Full Stack Developer
    image: { type: String, required: true }, // Cloudinary URL
    paragraphs: { type: [String], default: [] }, // டைனமிக் பேராகிராஃப்கள்
    infoCards: { type: [infoCardSchema], default: [] }, // டைனமிக் இன்ஃபோ கார்டுகள்
  },
  { timestamps: true }
);

const AboutModel = mongoose.model("About", aboutSchema);
export default AboutModel;