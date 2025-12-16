import React, { useState } from "react";
import upload_area from "../assets/upload_area.svg";
import { toast } from "react-toastify";
import API from "../services/api"; // axios instance with baseURL + interceptor
import Container from "../components/Container";
import Sidebar from '../components/Sidebar'
import "../App.css"; // Ensure glass-effect is imported

function AddAlumni() {
  const [alumniImg, setAlumniImg] = useState(null); // base64 string for preview + backend

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    yearOfPassing: "",
    cgpa: "",
    batch: "",
    degree: "",
    department: "CSE",
    courses: "",
    currentCompany: "",
    position: "",
    achievements: "",
    linkedin: "",
    github: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image → base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAlumniImg(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result is a data URL (base64)
      setAlumniImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!alumniImg) {
        return toast.error("Profile image not selected");
      }

      // Convert comma separated to arrays
      const coursesArray = formData.courses
        ? formData.courses
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const achievementsArray = formData.achievements
        ? formData.achievements
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        yearOfPassing: Number(formData.yearOfPassing),
        cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
        batch: formData.batch,
        degree: formData.degree,
        department: formData.department,
        currentCompany: formData.currentCompany,
        position: formData.position,
        linkedin: formData.linkedin,
        github: formData.github,
        courses: coursesArray,
        achievements: achievementsArray,
        image: alumniImg, // 👈 base64 string
      };

      const { data } = await API.post("/admin/alumni", payload);

      if (data.success) {
        toast.success(data.message || "Alumni added successfully");

        // Reset state
        setAlumniImg(null);
        setFormData({
          name: "",
          email: "",
          contact: "",
          yearOfPassing: "",
          cgpa: "",
          batch: "",
          degree: "",
          department: "CSE",
          courses: "",
          currentCompany: "",
          position: "",
          achievements: "",
          linkedin: "",
          github: "",
        });
      } else {
        toast.error(data.message || "Failed to add alumni");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while adding alumni"
      );
    }
  };

  const inputClass = "border border-[#0E2346]/50 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50";
  const labelClass = "block font-medium text-[#3A2C18] mb-1";
  const sectionTitleClass = "text-xl font-bold text-[#3A2C18] mb-3 border-b border-[#0E2346]/50 pb-1 mt-4";

  return (
    // Set warm background color
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          ➕ Add New Alumni Record
        </h1>
        
        <form onSubmit={onSubmitHandler} className="w-full">
          {/* Main Form Container - Applied glass effect */}
          <div className="glass-effect shadow-xl rounded-xl p-8 w-full ">

            {/* Image Upload */}
            <h2 className={sectionTitleClass}>Profile Photo</h2>
            <div className="flex items-center gap-6 mb-8">
              <label htmlFor="alumni-img" className="cursor-pointer flex-shrink-0">
                <img
                  src={alumniImg || upload_area}
                  alt="Profile"
                  className="w-24 h-24 object-cover bg-white/50 rounded-full border-4 border-[#0E2346] shadow-md transition-shadow hover:shadow-lg"
                />
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                id="alumni-img"
                hidden
                accept="image/*"
              />
              <p className="text-[#4A3D31] text-sm">
                Click the circle above to upload the alumni's profile picture. <br/> **Required** for directory visibility.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-10">
              {/* Left Column: Personal & Academic Info */}
              <div className="w-full lg:flex-1 flex flex-col gap-4">
                <h2 className={sectionTitleClass}>Personal & Academic Details</h2>

                <div>
                  <label className={labelClass}>Name *</label>
                  <input name="name" onChange={handleChange} value={formData.name} className={inputClass} type="text" placeholder="Full Name" required />
                </div>

                <div>
                  <label className={labelClass}>Email *</label>
                  <input name="email" onChange={handleChange} value={formData.email} className={inputClass} type="email" placeholder="Email" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Contact</label>
                        <input name="contact" onChange={handleChange} value={formData.contact} className={inputClass} type="text" placeholder="Contact number" />
                    </div>
                    <div>
                        <label className={labelClass}>Year of Passing *</label>
                        <input name="yearOfPassing" onChange={handleChange} value={formData.yearOfPassing} className={inputClass} type="number" placeholder="e.g. 2022" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>CGPA (0–10)</label>
                        <input name="cgpa" onChange={handleChange} value={formData.cgpa} className={inputClass} type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5" />
                    </div>
                    <div>
                        <label className={labelClass}>Batch</label>
                        <input name="batch" onChange={handleChange} value={formData.batch} className={inputClass} type="text" placeholder="e.g. 2018-2022" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Degree</label>
                        <input name="degree" onChange={handleChange} value={formData.degree} className={inputClass} type="text" placeholder="e.g. B.Tech, MCA" />
                    </div>
                    <div>
                        <label className={labelClass}>Department</label>
                        <select name="department" onChange={handleChange} value={formData.department} className={inputClass}>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                            <option value="EE">EE</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                  <label className={labelClass}>Courses <span className="text-xs text-[#0E2346]">(Comma separated)</span></label>
                  <input name="courses" onChange={handleChange} value={formData.courses} className={inputClass} type="text" placeholder="e.g. DSA, DBMS, OS" />
                </div>

              </div>

              {/* Right Column: Career & Achievements */}
              <div className="w-full lg:flex-1 flex flex-col gap-4">
                <h2 className={sectionTitleClass}>Career & Social Links</h2>
                
                <div>
                  <label className={labelClass}>Current Company</label>
                  <input name="currentCompany" onChange={handleChange} value={formData.currentCompany} className={inputClass} type="text" placeholder="e.g. Google" />
                </div>

                <div>
                  <label className={labelClass}>Position</label>
                  <input name="position" onChange={handleChange} value={formData.position} className={inputClass} type="text" placeholder="e.g. SDE-1, Project Manager" />
                </div>
                
                <div>
                  <label className={labelClass}>Achievements <span className="text-xs text-[#0E2346]">(Comma separated)</span></label>
                  <input name="achievements" onChange={handleChange} value={formData.achievements} className={inputClass} type="text" placeholder="e.g. GSoC, Hackathon Winner, Patent Holder" />
                </div>

                <div className="mt-4">
                  <label className={labelClass}>LinkedIn URL</label>
                  <input name="linkedin" onChange={handleChange} value={formData.linkedin} className={inputClass} type="url" placeholder="https://linkedin.com/in/..." />
                </div>

                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input name="github" onChange={handleChange} value={formData.github} className={inputClass} type="url" placeholder="https://github.com/..." />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // Styled button with dark primary color
              className="bg-[#0E2346] text-white px-10 py-3 mt-8 rounded-lg font-semibold shadow-lg hover:bg-[#0E2346]/90 transition duration-300 cursor-pointer"
            >
              Add Alumni Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAlumni;