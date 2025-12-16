import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // OPTIONAL
    },
    
  },
  { timestamps: true }
);

const galleryModel = mongoose.model("gallery", gallerySchema);

export default galleryModel;
