import cloudinary from "../config/cloudinary.js";
import galleryModel from "../models/galleryModel.js";

const addGalleryItem = async (req, res) => {
  try {
    const { image, description } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "alumni-gallery",
    });

    const newItem = await galleryModel.create({
      image: uploadResponse.secure_url,
      description: description || "",
      cloudinaryId: uploadResponse.public_id,
      userId: req.user?._id || null,
    });

    return res.status(201).json({
      message: "Image uploaded successfully.",
      galleryItem: newItem,
    });
  } catch (error) {
    console.error("Error in addGalleryItem:", error);
    res.status(500).json({ message: "Failed to upload image.", error: error.message });
  }
};

const getGalleryItems = async (req, res) => {
  try {
    console.log("Fetching gallery items...");

    const galleryItems = await galleryModel
      .find({})
      .sort({ createdAt: -1 });

    console.log(`Fetched ${galleryItems.length} gallery items`);

    return res.status(200).json({
      message: "Gallery items fetched successfully.",
      galleryItems,
    });
  } catch (error) {
    console.error("Error in getGalleryItems:", error);
    return res.status(500).json({
      message: "Failed to fetch gallery items.",
      error: error.message,
    });
  }
};

export { addGalleryItem, getGalleryItems };
