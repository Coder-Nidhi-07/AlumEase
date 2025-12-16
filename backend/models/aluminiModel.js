// models/Alumni.js
import mongoose from "mongoose";

// Alumni schema
const alumniSchema = new mongoose.Schema(
  {
    // Basic info


    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {type:String, default:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTgiIGhlaWdodD0iOTgiIHZpZXdCb3g9IjAgMCA5OCA5OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDkiIGN5PSI0OSIgcj0iNDkiIGZpbGw9IiNGNUY1RjUiLz4KPHBhdGggZD0iTTQ5LjEwMDggNDYuMTAwMUM1Mi40NDIyIDQ2LjEwMDEgNTUuMTUwOSA0My4zOTE0IDU1LjE1MDkgNDAuMDUwMUM1NS4xNTA5IDM2LjcwODcgNTIuNDQyMiAzNCA0OS4xMDA4IDM0QzQ1Ljc1OTUgMzQgNDMuMDUwOCAzNi43MDg3IDQzLjA1MDggNDAuMDUwMUM0My4wNTA4IDQzLjM5MTQgNDUuNzU5NSA0Ni4xMDAxIDQ5LjEwMDggNDYuMTAwMVoiIGZpbGw9IiNBQUFBQUEiLz4KPHBhdGggb3BhY2l0eT0iMC41IiBkPSJNNjEuMjAwMiA1Ny40NDNDNjEuMjAwMiA2MS4yMDIxIDYxLjIwMDIgNjQuMjQ5MyA0OS4xMDAxIDY0LjI0OTNDMzcgNjQuMjQ5MyAzNyA2MS4yMDIxIDM3IDU3LjQ0M0MzNyA1My42ODQgNDIuNDE3NCA1MC42MzY3IDQ5LjEwMDEgNTAuNjM2N0M1NS43ODI4IDUwLjYzNjcgNjEuMjAwMiA1My42ODQgNjEuMjAwMiA1Ny40NDNaIiBmaWxsPSIjQUFBQUFBIi8+Cjwvc3ZnPgo="},
    contact: {
      type: String,
      trim: true,
    },
    // Academic info
    yearOfPassing: {
      type: Number,
      required: true, // Year they graduated
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10, // Assuming scale of 10
    },
    batch: {
      type: String, // e.g., "2018-2022"
    },
    courses: {
      type: [String], // Array of courses studied
    },
    degree: {
      type: String, // e.g., "B.Tech", "MCA"
    },
   department: {
    type: String,
    enum: ["CSE", "ECE", "ME", "CE", "EE", "Other"], 
    required: true
},
    // Professional info
    currentCompany: {
      type: String,
    },
    position: {
      type: String,
    },
    achievements: {
      type: [String], // Array of achievements, awards, or recognitions
    },

    // Optional social links
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // Track creation and update times
);

// Export model
export default mongoose.model("Alumni", alumniSchema);
