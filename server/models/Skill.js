import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true }, // react-icons key (e.g. "HTML", "React", "Tailwind")
    color: { type: String, required: true, trim: true }, // Hex code (e.g. "#E44D26")
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SkillModel = mongoose.model("Skill", skillSchema);
export default SkillModel;