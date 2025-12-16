import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import feedbackModel from "../models/feedbackModel.js";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

// User creation
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Detail",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length should be atleast 8",
      });
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: "user",
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "28d",
    });

    res
      .status(200)
      .json({
        success: true,
        token,
        user: { name: user.name, email: user.email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// for user profile

const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from decoded JWT
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing in token.",
      });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile.",
      error: error.message,
    });
  }
};

// Get all users (for directory)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude password
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create feedback
const addFeedback = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const userId = req.user.id; // decoded from middleware

    if (!message || !rating) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = new feedbackModel({
      userId,
      message,
      rating,
    });

    await feedback.save();

    res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all feedback (admin OR public display)
// Get all feedback from all users
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await feedbackModel
      .find()
      .sort({ createdAt: -1 }) // latest first
      .populate("userId", "name email profileImage");
    // add any fields you want from user model

    return res.status(200).json({
      success: true,
      count: feedbackList.length,
      feedback: feedbackList,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback.",
      error: error.message,
    });
  }
};

// search alumini
const searchAlumni = async (req, res) => {
  try {
    const { q, year, course, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (year) filter.yearOfPassing = year;
    if (course) filter.course = course;

    const results = await Alumni.find(filter).skip(skip).limit(limit);

    const total = await Alumni.countDocuments(filter);

    res.json({ results, total });
  } catch (error) {
    console.log("Search Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      name,
      dob,
      gender,
      phone,
      yearOfPassing,
      cgpa,
      batch,
      course,
      degree,
      department,
      currentCompany,
      position,
      achievements,
      linkedIn,
      github,
      profileImage, // Base64 string coming from frontend
    } = req.body;

    // ⚠️ Ensure achievements is an array
    if (achievements && typeof achievements === "string") {
      achievements = achievements.split(",").map((x) => x.trim());
    }

    const updateData = {
      name,
      dob,
      gender,
      phone,
      yearOfPassing,
      cgpa,
      batch,
      course,
      degree,
      department,
      currentCompany,
      position,
      achievements,
      linkedIn,
      github,
    };

    // 🔥 If user updates profile image → upload to Cloudinary
    if (profileImage && profileImage.startsWith("data:image")) {
      const upload = await cloudinary.uploader.upload(profileImage, {
        folder: "alumni-profiles",
      });
      updateData.profileImage = upload.secure_url;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  addFeedback,
  getAllFeedback,
  searchAlumni,
  updateProfile,
};
