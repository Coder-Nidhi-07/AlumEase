import React, { useState, useEffect } from "react";
import API from "../services/api";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar"

const Announcements = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/admin/announcement");
      setAnnouncements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title || !message) return alert("Title and Message are required.");
    try {
      await API.post("/admin/announcement", { title, message });
      fetchAnnouncements();
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Failed to add announcement", err);
      alert("Failed to add announcement. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await API.delete(`/admin/announcement/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement", err);
      alert("Failed to delete announcement. Check console for details.");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Assuming you are using the 'glass-effect' class defined in your global CSS
  const role = localStorage.getItem("role"); 

  return (
    // Updated container background to match MainPage
    <div className="min-h-screen flex"> 
      <Sidebar />
      {/* Main Content Area */}
      <div className="p-8 w-full max-w-5xl mx-auto"> 
        <h2 className="text-4xl mb-6 font-bold text-[#3A2C18] border-b-2 border-[#D48C45] pb-2">
          📢 University Announcements
        </h2>

        {/* Admin Form to Add Announcement */}
        {role === 'admin' && (
          <div className="glass-effect p-6 rounded-xl mb-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-[#3A2C18] mb-4">Create New Announcement</h3>
            <input
              className="border border-[#0E2346] p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-[#0E2346] outline-none transition"
              placeholder="Announcement Title (e.g., VC Message, Event Update)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border border-[#0E2346] p-3 w-full mb-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-[#0E2346] outline-none transition"
              placeholder="Detailed Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              onClick={handleAdd}
              className="bg-[#0E2346] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0E2346]/90 transition duration-300 shadow-md cursor-pointer"
            >
              Post Announcement
            </button>
          </div>
        )}

        {/* Announcement List */}
        <h3 className="text-2xl font-bold text-[#3A2C18] mt-8 mb-4">Recent Posts</h3>
        
        {isLoading ? (
          <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">Loading announcements...</div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item._id} className="glass-effect p-5 rounded-xl border-l-4 border-[#D48C45] hover:shadow-xl transition duration-300">
                <h3 className="font-bold text-xl text-[#3A2C18] mb-1">{item.title}</h3>
                <p className="text-[#4A3D31] mb-2">{item.message}</p>
                <p className="text-[#5B4633] text-sm mt-1 opacity-80">
                  Posted on: {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                </p>
                
                {role === 'admin' && (
                  <button
                    className="bg-red-600 text-white px-4 py-1 text-sm rounded-lg mt-3 hover:bg-red-700 transition"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">
            No announcements available at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
