import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom"; // 🔑 Import Link for the button
import "../App.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/admin/login", { email, password });

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("role", "admin");
        
        toast.success(data.message || "Login successful");
        
        navigate('/dashboard');
        setPassword("");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Set warm background color
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmitHandler}>
        <div 
          // Applied glass effect, custom border, shadow, and reduced width
          className="glass-effect flex flex-col gap-4 p-8 w-full max-w-sm rounded-2xl border border-[#0E2346]/50 shadow-2xl relative" // 🔑 Added 'relative' for absolute positioning of the close button
        >
          {/* 🔑 CROSS BUTTON */}
          <Link to="/">
            <button 
              type="button" // Important to prevent form submission
              className="absolute top-3 right-4 text-2xl font-bold text-[#3A2C18] cursor-pointer hover:text-red-600 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </Link>
          
          <p className="text-3xl font-extrabold m-auto text-[#0E2346] pt-4"> 
            AlumEase Admin Login
          </p>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#3A2C18] mb-1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#0E2346]/50 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#0E2346]] outline-none transition text-[#3A2C18] bg-white/50"
              type="email"
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#3A2C18] mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#0E2346]/50 rounded-lg w-full p-3 focus:ring-2 focus:ring-[#0E2346] outline-none transition text-[#3A2C18] bg-white/50"
              type="password"
              required
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0E2346] text-white w-full py-3 mt-2 rounded-lg text-base font-semibold shadow-md hover:bg-[#0E2346]/90 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;