import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Ensure glass-effect is imported

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Added loading state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    yearOfPassing: "",
    cgpa: "",
    batch: "",
    course: "",
    degree: "",
    department: "",
    currentCompany: "",
    position: "",
    achievementsText: "",
    linkedIn: "",
    github: "",
    profileImage: "",
  });

  const readOnly = !isEditing;

  // 🔹 Fetch user profile from backend on mount
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get("/user/profile");
      if (!res.data.success) {
        toast.error(res.data.message || "Failed to load profile");
        return;
      }

      const user = res.data.user;
      setProfile(user);

      // Utility function to format date for input field
      const formatDob = (dateStr) => {
        if (!dateStr || dateStr === "Not Selected") return "";
        try {
          const date = new Date(dateStr);
          if (isNaN(date)) return "";
          return date.toISOString().split('T')[0];
        } catch {
          return "";
        }
      };

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: formatDob(user.dob),
        gender: user.gender && user.gender !== "Not Selected" ? user.gender : "",
        yearOfPassing: user.yearOfPassing || "",
        cgpa: user.cgpa || "",
        batch: user.batch || "",
        course: user.course || "",
        degree: user.degree || "",
        department: user.department || "",
        currentCompany: user.currentCompany || "",
        position: user.position || "",
        achievementsText: Array.isArray(user.achievements)
          ? user.achievements.join(", ")
          : "",
        linkedIn: user.linkedIn || "",
        github: user.github || "",
        profileImage: user.profileImage || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast.error("Failed to fetch profile");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Handle normal input changes
  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 When user clicks image (in edit mode), open file picker
  const handleImageClick = () => {
    if (!isEditing) return;
    document.getElementById("profileImageInput")?.click();
  };

  // 🔹 Convert selected image to base64 (backend will upload to Cloudinary)
  const handleImageChange = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result, // base64 string
      }));
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Save profile (PUT /user/profile)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const achievementsArray = formData.achievementsText
        ? formData.achievementsText
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: formData.name,
        dob: formData.dob || "Not Selected",
        gender: formData.gender || "Not Selected",
        phone: formData.phone,
        yearOfPassing: formData.yearOfPassing,
        cgpa: formData.cgpa,
        batch: formData.batch,
        course: formData.course,
        degree: formData.degree,
        department: formData.department,
        currentCompany: formData.currentCompany,
        position: formData.position,
        achievements: achievementsArray,
        linkedIn: formData.linkedIn,
        github: formData.github,
        profileImage: formData.profileImage, // base64 or existing URL
      };

      const res = await API.put("/user/profile", payload);
      if (!res.data.success) {
        toast.error(res.data.message || "Failed to update profile");
        return;
      }

      toast.success(res.data.message || "Profile updated successfully");

      // Refetch profile to update state cleanly
      fetchProfile();
      
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while updating profile"
      );
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#F8E8C8] flex">
            <Sidebar />
            <div className="p-8 w-full max-w-7xl mx-auto text-center text-[#3A2C18] font-semibold">
                Loading profile data...
            </div>
        </div>
    );
  }

  return (
    // Applied background color
    <div className="min-h-screen bg-[#F8E8C8] flex">
      <Sidebar />

      <div className="w-full p-8 max-w-5xl mx-auto">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-[#D48C45] pb-2">
          <h2 className="text-4xl font-extrabold text-[#3A2C18]">
            👤 My Profile
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Top: Profile image + basic info + Edit button */}
        <div className="glass-effect p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 border border-[#D48C45]/50">
          <div className="flex flex-col items-center">
            <img
              src={
                formData.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              onClick={handleImageClick}
              className={`w-32 h-32 rounded-full object-cover shadow-xl border-4 ${
                isEditing 
                    ? "border-[#0E2346] ring-4 ring-[#0E2346]/30 cursor-pointer" 
                    : "border-[#0E2346] cursor-default"
              } transition duration-300`}
            />
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {isEditing && <p className="text-xs text-[#0E2346] mt-1">Click to change photo</p>}
          </div>

          <div className="text-center sm:text-left pt-2">
            <p className="text-3xl font-extrabold text-[#3A2C18]">
              {formData.name || "Your Name"}
            </p>
            <p className="text-lg text-[#5B4633] mb-3">
                {formData.position && <span className="font-semibold">{formData.position}</span>}
                {(formData.position && formData.currentCompany) && " @ "}
                {formData.currentCompany && <span className="italic">{formData.currentCompany}</span>}
            </p>

            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className={`mt-2 px-6 py-2 rounded-lg font-semibold transition duration-300 shadow-md ${
                isEditing 
                    ? "bg-red-500 text-white hover:bg-red-600" 
                    : "bg-[#0E2346] text-white hover:bg-[#0E2346]/90"
              }`}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Main form – all data visible, editable only in edit mode */}
        <form
          onSubmit={handleSubmit}
          className="glass-effect grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl shadow-lg"
        >
            <h3 className="md:col-span-2 text-2xl font-bold text-[#3A2C18] border-b border-[#0E2346]/50 pb-2 mb-2">
                Personal & Academic Information
            </h3>

            {/* Input fields using the styled InputField component */}
            <InputField label="Name *" name="name" value={formData.name} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Email (Primary)" name="email" value={formData.email} disabled />

            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} readOnly={readOnly} />

            <InputField label="Gender" name="gender" value={formData.gender} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Year of Passing" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} readOnly={readOnly} />

            <InputField label="CGPA (out of 10)" name="cgpa" value={formData.cgpa} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Batch (e.g., 2018-2022)" name="batch" value={formData.batch} onChange={handleChange} readOnly={readOnly} />

            <InputField label="Degree" name="degree" value={formData.degree} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Department" name="department" value={formData.department} onChange={handleChange} readOnly={readOnly} />

            <h3 className="md:col-span-2 text-2xl font-bold text-[#3A2C18] border-b border-[#0E2346]/50 pb-2 mt-4 mb-2">
                Career & Achievements
            </h3>

            <InputField label="Current Company" name="currentCompany" value={formData.currentCompany} onChange={handleChange} readOnly={readOnly} />
            <InputField label="Position/Title" name="position" value={formData.position} onChange={handleChange} readOnly={readOnly} />
            
            <InputField label="LinkedIn URL" name="linkedIn" value={formData.linkedIn} onChange={handleChange} readOnly={readOnly} />
            <InputField label="GitHub URL" name="github" value={formData.github} onChange={handleChange} readOnly={readOnly} />

            {/* Achievements Textarea */}
            <div className="md:col-span-2">
              <label className="font-medium text-[#3A2C18] block mb-1">
                Achievements (comma separated)
                {!readOnly && <span className="text-xs text-[#0E2346]"> e.g. GSoC, Hackathon Winner</span>}
              </label>
              <textarea
                name="achievementsText"
                value={formData.achievementsText}
                onChange={handleChange}
                readOnly={readOnly}
                // Styled textarea
                className={`w-full rounded-lg px-3 py-2 ${
                  readOnly 
                    ? "bg-white/50 text-[#3A2C18] border-none" 
                    : "glass-effect border border-[#0E2346]/50 focus:ring-2 focus:ring-[#0E2346] outline-none text-[#3A2C18] bg-white/50"
                }`}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                type="submit"
                className="md:col-span-2 bg-[#0E2346] text-white py-3 rounded-lg font-semibold shadow-md hover:bg-[#0E2346]/90 transition duration-300 mt-4"
              >
                Save Changes
              </button>
            )}
        </form>
      </div>
    </div>
  );
}

// Reusable input component with theme styling
function InputField({
  label,
  name,
  value,
  onChange,
  readOnly,
  disabled,
  type = "text",
}) {
    const baseClass = "w-full rounded-lg px-3 py-2 transition duration-150";
    let finalClass = baseClass;
    
    if (disabled || readOnly) {
        // Read-only/Disabled styles
        finalClass += " bg-white/50 text-[#3A2C18] border-b-2 border-[#D48C45]/30 cursor-default opacity-90";
    } else {
        // Editable styles
        finalClass += " glass-effect border border-[#D48C45]/50 focus:ring-2 focus:ring-[#D48C45] outline-none text-[#3A2C18] bg-white/50";
    }

  return (
    <div>
      <label className="font-medium text-[#3A2C18] block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={finalClass}
      />
    </div>
  );
}

export default Profile;