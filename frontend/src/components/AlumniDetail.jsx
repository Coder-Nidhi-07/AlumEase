import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "./Container";
import Sidebar from "./Sidebar";
import API from "../services/api";
import upload_area from "../assets/upload_area.svg";
import { toast } from "react-toastify";
import "../App.css"; // Ensure glass-effect is imported

function AlumniDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const role = localStorage.getItem("role");

  // Fetch details
  const fetchAlumniDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/alumni/${id}`);
      setAlumni(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch alumni details. This profile may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumniDetail();
  }, [id]);

  // ==============================
  // ADMIN — EDIT FEATURES
  // ==============================
  const handleOpenEdit = () => {
    // Convert arrays back to comma-separated strings for textarea editing
    setEditForm({
      ...alumni,
      courses: alumni?.courses?.join(", ") || "",
      achievements: alumni?.achievements?.join(", ") || "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editForm,
        // Convert comma-separated strings back to arrays
        courses: editForm.courses.split(",").map((c) => c.trim()),
        achievements: editForm.achievements.split(",").map((a) => a.trim()),
      };

      await API.put(`/admin/alumni/${id}`, payload);
      toast.success("Profile updated successfully!");
      setShowEditModal(false);
      fetchAlumniDetail(); // Refresh data
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    }
  };

  // ==============================
  // ADMIN — DELETE ALUMNI
  // ==============================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this profile? This cannot be undone.")) return;
    try {
      await API.delete(`/admin/alumni/${id}`);
      toast.success("Alumni deleted");
      navigate("/directory");
    } catch (err) {
      toast.error("Failed to delete alumni.");
      console.error(err);
    }
  };

  // --- Loading State ---
  if (loading)
    return (
      <div className="min-h-screen bg-[#F8E8C8] flex">
        <Sidebar />
        <div className="p-8 w-full max-w-5xl mx-auto text-[#3A2C18] font-semibold text-center">
            Loading alumni details...
        </div>
      </div>
    );

  // --- Error/Not Found State ---
  if (error || !alumni)
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="p-8 w-full max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm bg-[#D48C45]/20 text-[#3A2C18] rounded-lg hover:bg-[#D48C45]/40 transition cursor-pointer">
            ← Back to Directory
          </button>
          <p className="text-xl font-bold text-red-600 mt-6">{error}</p>
        </div>
      </div>
    );

  // --- Main Render ---
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="w-full p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
            Alumni Profile View
        </h1>
        
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm bg-[#3A2C18] text-white rounded-lg hover:bg-[#2E2A1F] transition shadow-md">
            ← Back to Directory
          </button>

          <div className="flex items-center gap-3">
            {role === "admin" && (
              <>
                <button
                  onClick={handleOpenEdit}
                  className="px-4 py-2 bg-[#D48C45] text-[#3A2C18] font-semibold rounded-lg hover:bg-[#C27931] hover:text-white transition shadow-md"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                >
                  🗑 Delete Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-effect rounded-xl shadow-xl p-6 flex flex-col md:flex-row gap-8 mb-6 border border-[#D48C45]/50">
          <img
            src={alumni.image || upload_area}
            alt={alumni.name}
            className="w-32 h-32 rounded-full border-4 border-[#3A2C18] object-cover flex-shrink-0 shadow-lg"
          />

          <div className="flex-1">
            <h3 className="text-3xl font-extrabold text-[#3A2C18] mb-1">{alumni.name}</h3>

            <p className="text-[#D48C45] font-semibold text-lg">
              {alumni.degree} {alumni.department && `• ${alumni.department}`}
            </p>

            <p className="text-[#4A3D31] text-sm mt-1">
              Batch: {alumni.batch} | Year of Passing: {alumni.yearOfPassing}
            </p>

            {alumni.currentCompany && (
              <p className="mt-4 text-lg text-[#3A2C18] font-medium">
                {alumni.position} @ <span className="font-bold">{alumni.currentCompany}</span>
              </p>
            )}

            {/* Contact */}
            <div className="mt-4 text-sm space-y-1">
              <p>
                <strong>📧 Email:</strong>{" "}
                <a href={`mailto:${alumni.email}`} className="text-blue-600 underline hover:text-blue-800 transition">
                  {alumni.email}
                </a>
              </p>
              {alumni.contact && <p><strong>📞 Phone:</strong> {alumni.contact}</p>}
            </div>

            {/* Contact Buttons */}
            <div className="mt-4 flex gap-3">
              <a
                href={`mailto:${alumni.email}`}
                className="px-4 py-2 bg-[#3A2C18] text-white rounded-lg text-sm font-medium hover:bg-[#2E2A1F] transition shadow-md"
              >
                Send Email
              </a>

              {alumni.linkedin && (
                <a
                  href={alumni.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm font-medium hover:bg-[#004182] transition shadow-md"
                >
                  🔗 View LinkedIn
                </a>
              )}
               {alumni.github && (
                <a
                  href={alumni.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-md"
                >
                  💻 View GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Section (Academic & Professional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Academic */}
          <div className="glass-effect rounded-xl shadow-lg p-5 border border-[#D48C45]/50">
            <h4 className="text-xl font-bold mb-3 text-[#3A2C18]">Education Details</h4>
            
            <div className="space-y-2 text-[#4A3D31]">
                <p><strong>Degree:</strong> {alumni.degree}</p>
                <p><strong>Department:</strong> {alumni.department}</p>
                <p><strong>CGPA:</strong> <span className="font-bold">{alumni.cgpa}</span>/10</p>
            </div>

            {alumni.courses?.length > 0 && (
              <div className="mt-4">
                <strong className="text-[#3A2C18]">Key Courses:</strong>
                <ul className="list-disc ml-5 mt-1 text-sm text-[#4A3D31] grid grid-cols-2">
                  {alumni.courses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Professional */}
          <div className="glass-effect rounded-xl shadow-lg p-5 border border-[#D48C45]/50">
            <h4 className="text-xl font-bold mb-3 text-[#3A2C18]">Professional History</h4>

            <div className="space-y-2 text-[#4A3D31]">
                <p><strong>Current Company:</strong> {alumni.currentCompany}</p>
                <p><strong>Current Position:</strong> {alumni.position}</p>
            </div>
            

            {alumni.achievements?.length > 0 && (
              <div className="mt-4">
                <strong className="text-[#3A2C18]">Notable Achievements:</strong>
                <ul className="list-disc ml-5 mt-1 text-sm text-[#4A3D31]">
                  {alumni.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL (Styled to match Admin Panel) */}
      {showEditModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto relative border border-[#D48C45]/50 shadow-2xl">
            
            <button 
                type="button"
                className="absolute top-4 right-4 text-2xl font-bold text-[#3A2C18] hover:text-red-600 transition" 
                onClick={() => setShowEditModal(false)}
            >
                ✕
            </button>

            <h3 className="text-2xl font-bold text-[#3A2C18] mb-6 border-b border-[#D48C45]/50 pb-2">Edit Alumni Profile</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveEdit}>
              {[
                "name", "email", "contact", "degree", "department", "batch", 
                "currentCompany", "position", "linkedin", "github"
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={editForm[field] || ""}
                  onChange={handleEditChange}
                  className="glass-effect border border-[#D48C45]/50 p-3 rounded-lg focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50"
                  readOnly={field === "email"}
                />
              ))}

              <input
                name="yearOfPassing"
                type="number"
                placeholder="Year of Passing"
                value={editForm.yearOfPassing}
                onChange={handleEditChange}
                className="glass-effect border border-[#D48C45]/50 p-3 rounded-lg focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50"
              />

              <input
                name="cgpa"
                type="number"
                step="0.01"
                placeholder="CGPA (e.g. 8.5)"
                value={editForm.cgpa}
                onChange={handleEditChange}
                className="glass-effect border border-[#D48C45]/50 p-3 rounded-lg focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50"
              />

              <textarea
                name="courses"
                placeholder="Key Courses (comma separated)"
                value={editForm.courses}
                onChange={handleEditChange}
                className="glass-effect border border-[#D48C45]/50 p-3 rounded-lg focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50 col-span-full h-20"
              />

              <textarea
                name="achievements"
                placeholder="Achievements (comma separated)"
                value={editForm.achievements}
                onChange={handleEditChange}
                className="glass-effect border border-[#D48C45]/50 p-3 rounded-lg focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50 col-span-full h-24"
              />

              <div className="col-span-full flex justify-end gap-3 pt-4 border-t border-[#D48C45]/50">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-[#3A2C18] text-[#3A2C18] rounded-lg font-semibold hover:bg-[#3A2C18]/10 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-[#D48C45] text-white rounded-lg font-semibold hover:bg-[#C27931] transition shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlumniDetail;