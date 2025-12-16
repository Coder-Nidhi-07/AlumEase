import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // axios instance with baseURL configured
import "../App.css"; // Assuming glass-effect is here

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // NOTE: This effect is usually better handled in a parent layout component
    // but kept here for direct styling translation.
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? "/user/register" : "/user/login";

      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const { data } = await API.post(endpoint, payload);

      if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
      }

      // Save data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "user");
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 Notify Header to refresh automatically
      window.dispatchEvent(new Event("user-updated"));

      alert(isSignup ? "Signup successful!" : "Login successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 mb-4 border border-[#3A2C18]/30 rounded-lg bg-white focus:ring-2 focus:ring-[#0E2346] outline-none text-[#3A2C18] transition";
  const labelClass = "block text-left mb-1 font-medium text-[#3A2C18]";

  return (
    // Equivalent of overlayStyle using Tailwind
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
      
      {/* Equivalent of modalStyle and glass-effect */}
      <div className="glass-effect bg-[#F8E8C8] rounded-2xl w-full max-w-sm p-8 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <Link to={"/"}>
          <button className="absolute top-3 right-4 text-2xl font-bold text-[#3A2C18] cursor-pointer hover:text-red-500 transition">
            ✕
          </button>
        </Link>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-[#0E2346] mb-6">
          {isSignup ? "Create AlumEase Account" : "Login to AlumEase"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={inputClass}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </>
          )}

          <label className={labelClass}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={inputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <label className={labelClass}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={inputClass}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            // Equivalent of btnStyle using brand accent color
            className="bg-[#0E2346] text-white font-semibold border-none py-3 w-full rounded-lg cursor-pointer mt-4 transition duration-300 hover:bg-[#0E2346]/90 shadow-lg disabled:opacity-60"
          >
            {loading ? (isSignup ? "Signing Up..." : "Logging In...") : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>

        <p className="mt-4 text-[#3A2C18]">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-[#0E2346] cursor-pointer font-bold hover:underline transition"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;