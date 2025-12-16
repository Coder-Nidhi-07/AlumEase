// models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the schema for Admin
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Admin must have a name

    },
    email: {
      type: String,
      required: true, // Admin must have an email
      unique: true,   // Email must be unique
      lowercase: true,
    
    },
    password: {
      type: String,
      required: true, // Admin must have a password
    },
    profileImage: {
  type: String,
  default: "",
},

    role: {
      type: String,
      default: "admin", // Role is admin by default
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving to database
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password changed
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// Method to check password during login
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export Admin model
export default mongoose.model("Admin", adminSchema);
