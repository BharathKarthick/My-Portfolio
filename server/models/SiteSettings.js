import mongoose from "mongoose";

const homeSettingsSchema = new mongoose.Schema(
  {
    roleTitles: {
      type: [String],
      default: [
        "UI/UX Designer",
        "Web Developer",
        "Front-End Engineer",
      ],
      validate: {
        validator: (titles) =>
          titles.length > 0 &&
          titles.every(
            (title) => typeof title === "string" && title.trim().length > 0,
          ),
        message: "At least one valid role title is required",
      },
    },
    location: {
      type: String,
      default: "Chennai, Tamil Nadu, India",
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 2,
      min: 0,
    },
    terminalName: {
      type: String,
      default: "P. Bharath",
      trim: true,
    },
  },
  { _id: false },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
    },
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },
    resumePublicId: {
      type: String,
      default: "",
      trim: true,
    },
    home: {
      type: homeSettingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;