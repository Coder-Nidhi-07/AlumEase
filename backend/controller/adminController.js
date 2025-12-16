import Admin from "../models/adminModel.js";
import Alumni from "../models/aluminiModel.js";
import Event from "../models/eventModel.js";
import Announcement from "../models/announcementModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -------------------- ADMIN LOGIN --------------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate against env admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create token
      const token = jwt.sign(
        { email }, // payload
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Login successful",
        token, // <-- frontend will use this
        authHeader: `Bearer ${token}`, // <-- optional helper for client
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// -------------------- ADMIN PROFILE --------------------
export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json(req.admin); // protectAdmin already loads admin from token
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};



// -------------------- ALUMNI CRUD --------------------

// create alumini
export const createAlumni = async (req, res) => {
  try {
    const {
      image, // base64 string from frontend
      name,
      email,
      contact,
      yearOfPassing,
      cgpa,
      batch,
      degree,
      department,
      currentCompany,
      position,
      linkedin,
      github,
      courses,
      achievements,
    } = req.body;

    let imageUrl = undefined;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "alumni-profiles",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const alumni = await Alumni.create({
      name,
      email,
      contact,
      yearOfPassing,
      cgpa,
      batch,
      degree,
      department,
      currentCompany,
      position,
      linkedin,
      github,
      image: imageUrl, // stored cloudinary URL
      courses: Array.isArray(courses) ? courses : [],
      achievements: Array.isArray(achievements) ? achievements : [],
    });

    return res.status(201).json({
      success: true,
      message: "Alumni created successfully",
      alumni,
    });
  } catch (err) {
    console.error("Create Alumni Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all alumini

export const getAllAlumni = async (req, res) => {
  try {
    // Extract query params
    const { name, batch, department, location, page, limit } = req.query;

    // Build dynamic filter object
    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" }; // case-insensitive search
    if (batch) filter.batch = batch;
    if (department) filter.department = department;
    if (location) filter.location = { $regex: location, $options: "i" };

    // Pagination setup
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Get filtered alumni with pagination
    const total = await Alumni.countDocuments(filter);
    const alumniList = await Alumni.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ batch: -1, name: 1 }); // optional sorting: batch descending, name ascending

    res.json({
      total,
      page: pageNumber,
      pageSize,
      alumni: alumniList,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// get alumini by id

export const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: "Alumni not found" });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// update alumini
export const updateAlumni = async (req, res) => {
  try {
    const { image, ...rest } = req.body;

    let updateData = { ...rest };

    // Convert courses to array
    if (rest.courses) {
      updateData.courses = Array.isArray(rest.courses)
        ? rest.courses
        : rest.courses.split(",").map(c => c.trim());
    }

    // Convert achievements to array
    if (rest.achievements) {
      updateData.achievements = Array.isArray(rest.achievements)
        ? rest.achievements
        : rest.achievements.split(",").map(a => a.trim());
    }

    // Upload image if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "alumni-profiles",
      });
      updateData.image = uploadResponse.secure_url;
    }

    const alumni = await Alumni.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: "Alumni not found" });
    }

    res.json({
      success: true,
      message: "Alumni updated successfully",
      alumni,
    });

  } catch (err) {
    console.error("Update Alumni Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Delete alumini

export const deleteAlumni = async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: "Alumni deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- EVENT CRUD --------------------
export const createEvent = async (req, res) => {
  try {
    const { image, title, description, startDate, endDate, venue } = req.body;

    if (!image || !title || !description || !startDate || !endDate) {
      return res.status(400).json({
        message: "Image, title, description, start date, and end date are required.",
      });
    }

    // Upload base64 image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "alumni-events",
    });

    const event = await Event.create({
      image: uploadRes.secure_url,
      title,
      description,
      startDate,
      endDate,
      venue,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(updatedEvent);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// CREATE Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET All Announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (req.body.name) admin.name = req.body.name;
    if (req.body.email) admin.email = req.body.email;
    if (req.body.password) admin.password = req.body.password;

    if (req.file) admin.profileImage = `/uploads/${req.file.filename}`; // 🔥 save image path

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// search alumini
export const searchAlumni = async (req, res) => {
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
