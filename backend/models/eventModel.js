// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,       // Cloudinary URL
    },
    title: {
      type: String,
      required: true,       // Event name / title
    },
    description: {
      type: String,
      required: true,       // Details about the event
    },
    startDate: {
      type: Date,
      required: true,       // Event start date
    },
    endDate: {
      type: Date,
      required: true,       // Event end date
    },
    venue: {
      type: String,
      default: "Online",    // Event venue / place
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
