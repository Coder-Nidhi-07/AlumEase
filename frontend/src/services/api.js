import axios from "axios";

// Create Axios instance with base URL
const API = axios.create({
  baseURL: "https://alumeasebackend.onrender.com/api", // your backend URL
});

// ✅ Attach JWT token automatically to every request
API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const isAdminRoute =
      config.url?.startsWith("/admin") || config.url?.includes("/admin/");

    // For admin routes → prefer adminToken
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    // For non-admin routes → use normal user token
    else if (!isAdminRoute && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Global response interceptor to handle 401 (Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("Server not reachable. Please try again later.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message?.toLowerCase() || "";
    const config = error.config || {};
    const isAdminRoute =
      config.url?.startsWith("/admin") || config.url?.includes("/admin/");

    if (
      status === 401 &&
      (message.includes("token") ||
        message.includes("expired") ||
        message.includes("unauthorized"))
    ) {
      if (isAdminRoute) {
        // 🔐 Admin session expired
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");
        alert("Admin session expired or unauthorized. Please login again.");
        window.location.href = "/admin/login";
      } else {
        // 👤 Normal user session expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        alert("Session expired or unauthorized. Please login again.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
