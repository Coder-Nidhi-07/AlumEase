import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://alumeasebackend.onrender.com/api/user"; // Backend URL

function Feedback() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      // Use the token for fetching feedback if necessary for authorization
      const { data } = await axios.get(`${BASE_URL}/feedback/all`); 
      if (data.success) {
        setFeedbackList(data.feedback);
      }
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || rating === 0) {
      toast.error("Please provide a message and a rating (1-5 stars).");
      return;
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/feedback`,
        { message, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Feedback submitted successfully. Thank you!");
        setMessage("");
        setRating(0);
        fetchFeedback();
      }
    } catch (err) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    // Applied background color to match MainPage
    <div className="min-h-screen flex">
      <Sidebar />

      {/* Main Content Area */}
      <div className="w-full p-8 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          ⭐ Platform Feedback
        </h2>

        {/* Feedback List */}
        <h3 className="text-2xl font-bold text-[#3A2C18] mb-4 border-b-2 border-[#D48C45]/50 pb-2">
          All Submitted Feedback
        </h3>
        
        {isLoading ? (
          <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">Loading feedback...</div>
        ) : feedbackList.length === 0 ? (
          <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">
            No feedback submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {feedbackList.map((fb) => (
              <div key={fb._id} 
                   // Applied glass effect, border highlight, and shadow
                   className="glass-effect p-5 rounded-xl border-l-4 border-[#D48C45] shadow-md transition duration-200 hover:shadow-lg"
              >
                {/* Rating display */}
                <p className="text-xl font-medium text-[#D48C45]">
                  {"★".repeat(fb.rating)}{" "}
                  <span className="text-[#3A2C18]/30">
                    {"★".repeat(5 - fb.rating)}
                  </span>
                </p>
                <p className="mt-2 text-[#3A2C18]">{fb.message}</p>
                <p className="text-[#5B4633] text-sm mt-2 opacity-80">
                  — {fb.userId?.name || "Anonymous Alumnus"} 
                  {fb.userId?.email && ` (${fb.userId.email})`}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Submit feedback Form */}
        {role !== "admin" && (
          <form
            onSubmit={handleSubmit}
            // Applied glass effect and shadow
            className="glass-effect p-6 rounded-xl mt-8 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-[#3A2C18] mb-4">
              Share Your Experience
            </h3>

            {/* ⭐ Star Rating */}
            <label className="block mb-2 font-medium text-[#3A2C18]">
              Rating ({rating} of 5)
            </label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-4xl transition-colors duration-200 ${
                    // Using brand color for active stars
                    rating >= star ? "text-[#D48C45]" : "text-[#3A2C18]/30 hover:text-[#3A2C18]/50"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <label className="block mb-2 font-medium text-[#3A2C18]">
              Your Feedback Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              // Styled textarea with theme colors
              className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full mb-4 resize-none focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
              placeholder="How can we improve AlumEase? We value your input..."
            />

            <button
              type="submit"
              // Styled button with dark primary color
              className="bg-[#0E2346] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0E2346]/90 cursor-pointer transition duration-300 shadow-md"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Feedback;
