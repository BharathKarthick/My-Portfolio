import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    type: { type: String, default: "Intern" },
    skills: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ExperienceModel = mongoose.model("Experience", experienceSchema);
export default ExperienceModel;