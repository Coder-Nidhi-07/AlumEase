// routes/adminRouter.js
import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {

    getAdminProfile,
  adminLogin,
  createAlumni,
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
   createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  updateAdminProfile,
  searchAlumni,
} from "../controller/adminController.js";
import { protectAdmin } from "../middleware/authAdmin.js";


const adminRouter = express.Router();

// ------------------ ADMIN AUTH ------------------
adminRouter.post("/login", adminLogin); // Admin login
adminRouter.get("/profile", protectAdmin, getAdminProfile);
adminRouter.put("/profile", protectAdmin, upload.single("profileImage"), updateAdminProfile);


// ------------------ ALUMNI ROUTES ------------------
adminRouter.post("/alumni", protectAdmin, createAlumni);       // Add new alumni
adminRouter.get("/alumni", getAllAlumni);        // Get all alumni
adminRouter.get("/alumni/:id", getAlumniById);   // Get single alumni
adminRouter.put("/alumni/:id", protectAdmin, updateAlumni);    // Update alumni
adminRouter.delete("/alumni/:id", protectAdmin, deleteAlumni); // Delete alumni
adminRouter.get('/search',searchAlumni);

// ------------------ EVENT ROUTES ------------------
adminRouter.post("/events", protectAdmin, createEvent);        // Add new event
adminRouter.get("/events",  getAllEvents);       // Get all events
adminRouter.get("/events/:id", getEventById);   // Get single event
adminRouter.put("/events/:id", protectAdmin, updateEvent);    // Update event
adminRouter.delete("/events/:id", protectAdmin, deleteEvent); // Delete event

adminRouter.post("/announcement", protectAdmin, createAnnouncement);
adminRouter.get("/announcement", getAllAnnouncements);
adminRouter.delete("/announcement/:id", protectAdmin, deleteAnnouncement);
adminRouter.put(
  "/profile",
  protectAdmin,
  upload.single("profileImage"), // 🔥 add this
  updateAdminProfile
);



export default adminRouter;
