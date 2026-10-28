import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true }, // Cloudinary URL
    imagePublicId: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    frontendUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;