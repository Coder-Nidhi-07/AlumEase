import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "./Container";
import logo from "../assets/logo.png";
import userIcon from "../assets/userIcon.png";
import profileIcon from "../assets/profileIcon.png"
import logoutIcon from "../assets/logoutIcon.png"
import "../App.css"; // Ensure glass-effect is imported

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [openUserMenu, setOpenUserMenu] = useState(false); // 🔑 New state for User Dropdown
  const [openMobileNav, setOpenMobileNav] = useState(false); // 🔑 New state for Mobile Nav
  
  const userMenuRef = useRef(null); 
  const mobileNavRef = useRef(null); 

  const role = localStorage.getItem("role");

  // Load + refresh user from storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const refresh = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("user-updated", refresh);
    return () => window.removeEventListener("user-updated", refresh);
  }, []);

  // Closes both menus on navigation change
  useEffect(() => {
    setOpenUserMenu(false);
    setOpenMobileNav(false);
  }, [location.pathname]);

  // 🔑 Logic to close both menus on outside click
  useEffect(() => {
    const handler = (event) => {
      // Close user menu
      if (openUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
      // Close mobile nav
      if (openMobileNav && mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setOpenMobileNav(false);
      }
    };
    
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [openUserMenu, openMobileNav]);

  // USER logout
  const handleLogoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("user-updated"));
    navigate("/login");
  };

  // ADMIN logout
  const handleLogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Home", slug: "/" },
    { name: "Directory", slug: "/directory" },
    { name: "Events", slug: "/events" },
    { name: "Feedback", slug: "/feedback" },
    { name: "Gallery", slug: "/gallery" },
  ];
  
  const isLinkActive = (slug) => {
    if (slug === "/") return location.pathname === "/";
    return location.pathname.startsWith(slug);
  };

  return (
    <header className="bg-[#FFF1D3] shadow-lg sticky top-0 z-[100]"> {/* Increased Z-index */}
      <Container>
        <div className="flex justify-between items-center py-2"> 
          <Link to="/">
            <img src={logo} alt="AlumEase Logo" className="h-15 w-50 ml-8" />
          </Link>

          <nav className="text-[#0E2346]">
            <ul className="flex items-center gap-4">

              {/* ============================ ADMIN VIEW ============================= */}
              {role === "admin" && (
                <>
                  <li className="hidden sm:block">
                    <span className="text-sm italic text-[#0E2346] mr-2">Admin Mode</span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogoutAdmin}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200"
                    >
                      Logout Admin
                    </button>
                  </li>
                </>
              )}

              {/* ============================ USER VIEW (Desktop Navigation) ============================= */}
              {role !== "admin" && (
                <>
                  {/* Desktop Navigation Links */}
                  <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const active = isLinkActive(item.slug);
                        return (
                        <li key={item.name}>
                            <button
                            onClick={() => navigate(item.slug)}
                            className={`px-3 py-2 text-base font-semibold rounded-lg transition duration-200 ${
                                active
                                ? "bg-[#0E2346] text-white shadow-md"
                                : "text-[#0E2346] hover:bg-white/50"
                            }`}
                            >
                            {item.name}
                            </button>
                        </li>
                    )})}
                  </div>

                  {/* Logged in / Guest Menu (Always visible for user actions) */}
                  {!user ? (
                    <li>
                      <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-[#0E2346] text-white rounded-lg font-semibold hover:bg-[#0E2346]/90 transition duration-200 shadow-md"
                      >
                        Login / Join
                      </button>
                    </li>
                  ) : (
                    // Logged in user icon and menu
                    <li className="relative">
                      <img
                        src={user.profileImage || userIcon}
                        alt="user profile"
                        className="h-9 w-9 rounded-full cursor-pointer object-cover  transition duration-150"
                        onClick={() => setOpenUserMenu(!openUserMenu)} // 🔑 Use specific state
                      />

                      {/* 🔑 Styled User Dropdown Menu */}
                      {openUserMenu && (
                        <div 
                            ref={userMenuRef}
                            className="absolute right-0 bg-[#0E2346] backdrop-blur-md shadow-2xl rounded-lg mt-3 text-white w-44 z-[60] overflow-hidden border border-white/50" // 🔑 Styled with glass effect properties
                        >
                          <p className="px-4 py-2  font-bold truncate border-b text-2xl border-white bg-[#D48C45]/10">
                            {user.name}
                          </p>

                          <button
                            onClick={() => navigate("/profile")}
                            className="w-full text-left px-4 py-2 text-l transition cursor-pointer flex"
                          >
                            <span className="mr-2 flex"><img src={profileIcon} alt="" /></span> Profile
                          </button>

                          <button
                            onClick={handleLogoutUser}
                            className="w-full text-left px-4 py-2 text-l border-t border-white cursor-pointer flex"
                          >
                            <span className="mr-2 flex"><img src={logoutIcon} alt="" /></span> Logout
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                </>
              )}
              
              {/* 🔑 Mobile Navigation Toggle (Hamburger) */}
              <li className="md:hidden">
                  <button 
                      onClick={() => setOpenMobileNav(!openMobileNav)} 
                      className="text-[#0E2346] text-2xl p-1"
                  >
                      {openMobileNav ? '✕' : '☰'}
                  </button>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
      
      {/* Mobile Navigation Menu (Hidden by default, slides down) */}
      {openMobileNav && (
        <div 
            ref={mobileNavRef}
            className="md:hidden absolute w-full top-[56px] left-0 bg-[#0E2346] backdrop-blur-md shadow-xl border-t border-gray-200 z-[55] overflow-hidden" // 
        >
          <ul className="py-2">
            {navItems.map((item) => {
              const active = isLinkActive(item.slug);
              return (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`w-full text-left px-6 py-3 cursor-pointer font-semibold text-base transition duration-200 ${
                      active
                        ? "bg-[#0E2346] text-white border-r-4 border-white"
                        : "text-white hover:bg-[#0E2346]/30"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              );
            })}
            
            {/* Mobile Login/Join Button if not logged in */}
            {!user && (
                <li>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full text-center py-3 bg-[#0E2346] text-white font-semibold mt-2 transition duration-200"
                    >
                        Login / Join AlumEase
                    </button>
                </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;