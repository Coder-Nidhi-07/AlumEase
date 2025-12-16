import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import API from "../services/api"; // 🔑 API service imported from your configuration
import uniLogo from "../assets/unilogo.png";
import uni from "../assets/uni.jpg";
import mainIMG from "../assets/HeaderImg.png";
import cal from "../assets/calender.png"
import people from "../assets/people.png"
import announce from "../assets/announce.png"
import pin from "../assets/pin.png"

const dashboardData = {
  role: "alumni",
  upcomingEventTitle: "Annual Alumni Homecoming 2025",
  newAnnouncementCount: 2,
};

function MainPage() {
  const [announcements, setAnnouncements] = useState([]); // State for announcements list
  const [isLoading, setIsLoading] = useState(true); // State for loading
  
  const userRole = dashboardData.role;

  // --- Announcement Fetching Logic (Directly from Database) ---
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/admin/announcement");
      
      const allAnnouncements = Array.isArray(res.data) ? res.data : [];
      
      // Sort to get newest first
      const sortedAnnouncements = [...allAnnouncements].sort((a, b) => {
        const d1 = a.date ? new Date(a.date) : 0;
        const d2 = b.date ? new Date(b.date) : 0;
        return d2 - d1;
      });

      // Take the top 3 (or fewer) for the homepage display
      setAnnouncements(sortedAnnouncements.slice(0, 3));

    } catch (err) {
      console.error("Failed to fetch announcements", err);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Call fetch function on mount
  }, []);

  // Define Quick Actions
  const dashboardActions = {
    alumni: [
      { icon: <img src={cal} alt="" className="h-10"/>, title: "View All Events", link: "/events" },
      { icon: <img src={people} alt="" className="h-10"/>, title: "Alumni Directory", link: "/directory" }, // 🔑 Corrected link
      { icon: <img src={announce} alt="" className="h-10"/>, title: "Latest Announcements", link: "/announcements" },
    ],
  };

  const actions = dashboardActions[userRole] || dashboardActions.alumni;

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 px-6">
      {/* 🌟 1. HEADER & WELCOME MESSAGE */}
      <div className="flex flex-col lg:flex-row justify-center items-center max-w-6xl mx-auto mb-10">
        <div className="lg:w-1/2 p-4">
          <img src={mainIMG} alt="Alumni Group" className="w-full h-auto max-h-96 rounded-2xl shadow-xl object-cover" />
        </div>
        <div className="lg:w-1/2 p-4 text-center lg:text-left">
          <header className="w-full mb-6">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex">
              <p className="text-[#0E2346]">Alum</p><p className="text-[#D6933D]">Ease</p>
            </h1>
            <h2 className="text-xl font-medium text-[#5B4633]">
              Welcome to your centralized hub for the IKGPTU alumni
              community.AlumEase empowers institutions to effortlessly manage alumni
              information, streamline communication, and build long-lasting
              relationships between graduates and their alma mater. It goes far
              beyond maintaining records — it strengthens community, promotes
              collaboration, and supports growth for both students and alumni.
            </h2>
          </header>
        </div>
      </div>

      {/* 2. QUICK ACTIONS / NAVIGATION CARDS */}
      <div className="w-full max-w-6xl mb-12">
        <h3 className="text-2xl font-bold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          Quick Navigation
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="glass-effect p-6 rounded-2xl flex flex-col items-center text-center shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.03] hover:-translate-y-1"
            >
              <span className="text-5xl block mb-3">{action.icon}</span>
              <h4 className="font-bold text-xl mb-1 text-[#0E2346]">
                {action.title}
              </h4>
              <p className="text-[#0E2346]/80 text-sm">
                Jump straight to {action.title.toLowerCase()}.
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. FEATURED CONTENT (Events & Announcements) */}
      <div className="w-full max-w-6xl grid md:grid-cols-5 gap-8 mb-16">
        {/* LEFT COLUMN: FEATURED EVENT (2/5 width) */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
            Featured Event
          </h3>

          {/* Featured Event Card */}
          <div className="glass-effect p-6 rounded-2xl bg-[#D48C45]/80 text-[#3A2C18] mb-6">
            <h4 className="font-extrabold text-xl mb-2 text-[#3A2C18]">
              {dashboardData.upcomingEventTitle}
            </h4>
            <p className="font-medium mb-3 text-[#3A2C18] flex">
              <img src={pin} alt="" className="h-6"/> IKGPTU Main Campus, Kapurthala | Dec 20, 2025
            </p>
            <p className="text-sm text-[#3A2C18] opacity-90">
              Reconnect with faculty and classmates, and enjoy a day of
              celebration and networking.
            </p>
          </div>

          {/* IKGPTU Campus Image Placeholder */}
          <div className="rounded-2xl overflow-hidden shadow-lg mt-8 h-48 bg-gray-300 flex items-stretch text-gray-700">
            <img src={uni} alt="IKGPTU Campus" className="w-full h-full object-cover"/>
          </div>
        </div>

        {/* RIGHT COLUMN: ANNOUNCEMENTS (3/5 width) */}
        <div className="md:col-span-3">
          <h3 className="text-2xl font-bold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
            📢 Latest Announcements
          </h3>

          {isLoading ? (
            <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">Loading announcements...</div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div 
                    key={item._id} 
                    className="glass-effect p-5 rounded-xl border-l-4 border-[#3A2C18] hover:shadow-md transition duration-300" 
                >
                  <p className="font-semibold text-[#3A2C18]">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#4A3D31] line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-xs text-[#5B4633] mt-2 opacity-80">
                    Posted on: {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">
              No recent announcements available at this time.
            </div>
          )}

          <Link
            to="/announcements"
            className="mt-6 inline-block px-6 py-2 bg-[#0E2346] text-white font-semibold rounded-lg hover:bg-[#2E2A1F] transition duration-300 shadow-lg"
          >
            View All Announcements
          </Link>
        </div>
      </div>

      {/* 4. ALUMNI COMMUNITY & DIRECTORY FOCUS */}
      <div className="w-full max-w-6xl text-center pb-10">
        <h3 className="text-3xl font-bold text-[#3A2C18] mb-6">
          Connect with the IKGPTU Alumni Community
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Alumni Count Placeholder */}
          <div className="glass-effect p-6 rounded-xl hover:scale-[1.03] transition duration-300">
            <p className="text-5xl font-extrabold text-[#D48C45] mb-2">15K+</p>
            <h4 className="font-semibold text-lg text-[#3A2C18]">
              Registered Alumni
            </h4>
          </div>
          {/* Global Reach Placeholder */}
          <div className="glass-effect p-6 rounded-xl hover:scale-[1.03] transition duration-300">
            <p className="text-5xl font-extrabold text-[#D48C45] mb-2">35+</p>
            <h4 className="font-semibold text-lg text-[#3A2C18]">
              Countries Represented
            </h4>
          </div>
          {/* Directory Link */}
          <Link
            to="/directory"
            className="glass-effect p-6 rounded-xl bg-[#D48C45]/80 flex flex-col justify-center hover:shadow-xl transition duration-300"
          >
            <h4 className="font-extrabold text-xl text-[#D48C45]">
              Search the Directory
            </h4>
            <p className="text-[#3A2C18] opacity-90 text-sm mt-1">
              Find your classmates and connections.
            </p>
          </Link>
        </div>

        {/* IKGPTU Logo/Seal Placeholder */}
        <div className="mt-12 opacity-80 flex justify-center">
          <img src={uniLogo} alt="LOGO" className="h-40" />
        </div>
      </div>
      {/* Vision & Mission */}

      <div className="grid md:grid-cols-2 gap-6 mt-14 w-full max-w-4xl">
        <div className="glass-effect p-6 rounded-xl hover:scale-105 transition">
          <h3 className="font-bold text-xl mb-3 text-[#2E2A1F]">
            🎯 Our Vision
          </h3>

          <p className="text-[#4A3D31]">
            To create a globally connected alumni ecosystem where every graduate
            continues to learn, grow, and thrive beyond campus life.
          </p>
        </div>

        <div className="glass-effect p-6 rounded-xl hover:scale-105 transition">
          <h3 className="font-bold text-xl mb-3 text-[#2E2A1F]">
            💡 Our Mission
          </h3>

          <p className="text-[#4A3D31]">
            To unify data, communication, and engagement on a single platform,
            allowing institutions to build stronger and more meaningful alumni
            communities.
          </p>
        </div>
      </div>

      {/* Why choose AlumEase */}

      <h2 className="text-3xl font-bold text-[#3A2C18] mt-16 mb-6">
        Why Choose AlumEase?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl text-center mb-16">
        <div className="glass-effect p-5 rounded-lg hover:scale-105 transition">
          <h4 className="font-semibold text-lg mb-2">
            🔗 Stronger Alumni Network
          </h4>

          <p className="text-[#4A3D31]">
            Builds meaningful connections between graduates across different
            batches and disciplines.
          </p>
        </div>

        <div className="glass-effect p-5 rounded-lg hover:scale-105 transition">
          <h4 className="font-semibold text-lg mb-2">📢 Smart Engagement</h4>

          <p className="text-[#4A3D31]">
            Share updates, events, and opportunities instantly with alumni.
          </p>
        </div>

        <div className="glass-effect p-5 rounded-lg hover:scale-105 transition">
          <h4 className="font-semibold text-lg mb-2">📚 Centralized Info</h4>

          <p className="text-[#4A3D31]">
            All alumni data stored securely and accessible whenever needed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;