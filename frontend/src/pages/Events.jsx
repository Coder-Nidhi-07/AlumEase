import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { toast } from "react-toastify";
import "../App.css"; // Ensure your glass-effect is imported here

function Events() {
  const [events, setEvents] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "",
    imageBase64: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const role = localStorage.getItem("role");

  // Fetch all events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/admin/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image change (file → base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageBase64: reader.result, // send this to backend as `image`
      }));
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit event form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageBase64) {
      toast.error("Please select an event image");
      return;
    }

    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate || !formData.venue) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        image: formData.imageBase64,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        venue: formData.venue,
      };

      const res = await API.post("/admin/events", payload);
      toast.success(res.data.message || "Event created successfully");

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        venue: "",
        imageBase64: "",
      });
      setPreviewImage(null);

      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Event creation failed");
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/admin/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Event deletion failed");
    }
  };

  return (
    // Applied background color to the main container
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="p-8 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          📅 Upcoming Alumni Events
        </h2>

        {/* Add Event Form – only for admin */}
        {role === "admin" && (
          <form
            // Applied glass effect and shadow
            className="glass-effect p-6 shadow-xl rounded-xl mb-8 space-y-4"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-bold text-[#3A2C18] mb-2">Create New Event</h3>

            {/* Event Image Input */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#3A2C18]">
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                // Styled file input to match theme
                className="mt-1 block w-full text-sm text-[#3A2C18] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0E2346]/20 file:text-[#3A2C18] hover:file:bg-[#0E2346]/40 transition duration-200"
                required
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 h-32 object-cover rounded-lg shadow-md border border-[#0E2346]/50"
                />
              )}
            </div>

            {/* Title Input */}
            <input
              type="text"
              name="title"
              // Applied glass effect and theme colors to input
              className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
              placeholder="Event Title (e.g., Annual Homecoming, Tech Summit)"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Description Textarea */}
            <textarea
              name="description"
              // Applied glass effect and theme colors to input
              className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            {/* Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#3A2C18]">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  // Applied glass effect and theme colors to input
                  className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#3A2C18]">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  // Applied glass effect and theme colors to input
                  className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Venue Input */}
            <input
              type="text"
              name="venue"
              // Applied glass effect and theme colors to input
              className="glass-effect border border-[#0E2346]/50 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
              placeholder="Venue (e.g., University Auditorium or Online via Zoom)"
              value={formData.venue}
              onChange={handleChange}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              // Styled button with dark primary color
              className="bg-[#0E2346] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0E2346]/90 transition duration-300 shadow-md cursor-pointer"
            >
              Add Event
            </button>
          </form>
        )}

        {/* Events List */}
        <div className="glass-effect p-6 shadow-xl rounded-xl">
          <h3 className="text-2xl font-bold text-[#3A2C18] mb-4 border-b border-[#D48C45]/50 pb-2">
            Published Events
          </h3>

          {isLoading ? (
            <p className="text-[#4A3D31] text-center">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-[#4A3D31] text-center">No events found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => (
                <div
                  key={ev._id}
                  // Applied glass effect for list items
                  className="glass-effect rounded-xl shadow-lg overflow-hidden flex flex-col border border-[#D48C45]/20 hover:shadow-2xl transition duration-300 transform hover:-translate-y-0.5"
                >
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="h-44 w-full object-cover bg-gray-200"
                    />
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-extrabold text-xl text-[#3A2C18] mb-2">
                      {ev.title}
                    </h4>
                    <p className="text-sm text-[#4A3D31] mb-3 line-clamp-3">
                      {ev.description}
                    </p>

                    {/* Event Details */}
                    <div className="text-xs text-[#5B4633] space-y-1 mt-auto pt-2 border-t border-[#D48C45]/30">
                        <p>
                            <strong>Start:</strong>{" "}
                            {ev.startDate
                            ? new Date(ev.startDate).toLocaleDateString()
                            : "-"}
                        </p>
                        <p>
                            <strong>End:</strong>{" "}
                            {ev.endDate
                            ? new Date(ev.endDate).toLocaleDateString()
                            : "-"}
                        </p>
                        <p>
                            <strong>Venue:</strong>{" "}
                            <span className="font-semibold text-[#0E2346]">{ev.venue || "Online"}</span>
                        </p>
                    </div>

                    {role === "admin" && (
                      <button
                        className="mt-4 bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm self-start hover:bg-red-700 transition shadow-md"
                        onClick={() => deleteEvent(ev._id)}
                      >
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;