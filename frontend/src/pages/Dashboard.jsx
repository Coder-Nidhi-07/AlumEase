import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import upload_area from "../assets/upload_area.svg";
import "../App.css"; // Ensure glass-effect is imported

function Dashboard() {
  const [activeTab, setActiveTab] = useState("alumni");

  const [alumniList, setAlumniList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);

  const [alumniCount, setAlumniCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0); // 🔹 NEW

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      // 🔹 Fetch ALL dashboard data in parallel
      const [alumniRes, eventsRes, announcementsRes, usersRes] = await Promise.all([
        API.get("/admin/alumni", { params: { page: 1, limit: 5 } }),
        API.get("/admin/events"),
        API.get("/admin/announcement"),
        API.get("/user/all"), // <-- make sure this route exists in your backend
      ]);

      // Alumni
      const { alumni = [], total = 0 } = alumniRes.data || {};
      setAlumniList(alumni);
      setAlumniCount(total);

      // Events
      const allEvents = eventsRes.data || [];
      setEventsCount(allEvents.length);

      const sortedEvents = [...allEvents].sort((a, b) => {
        const d1 = a.startDate ? new Date(a.startDate) : 0;
        const d2 = b.startDate ? new Date(b.startDate) : 0;
        return d2 - d1;
      });
      setEventsList(sortedEvents.slice(0, 5));

      // Announcements
      const allAnnouncements = announcementsRes.data || [];
      setAnnouncementsCount(allAnnouncements.length);

      const sortedAnnouncements = [...allAnnouncements].sort((a, b) => {
        const d1 = a.date ? new Date(a.date) : 0;
        const d2 = b.date ? new Date(b.date) : 0;
        return d2 - d1;
      });
      setAnnouncementsList(sortedAnnouncements.slice(0, 5));

      // Users (from userModel)
      const allUsers = usersRes.data?.users || usersRes.data || [];
      setUsersCount(allUsers.length);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // Applied background color to the main container
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          📊 Admin Overview Dashboard
        </h1>

        {/* 🔹 Stats Row – Applied glass effect and brand colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", count: usersCount, icon: "👥" },
            { label: "Total Alumni", count: alumniCount, icon: "🎓" },
            { label: "Total Events", count: eventsCount, icon: "📅" },
            { label: "Total Announcements", count: announcementsCount, icon: "📣" },
          ].map((stat) => (
            <div key={stat.label} className="glass-effect rounded-xl shadow-lg p-5 border border-[#D48C45]/50">
              <p className="text-sm font-medium text-[#4A3D31] flex items-center">
                <span className="text-lg mr-2">{stat.icon}</span> {stat.label}
              </p>
              <p className="text-3xl font-extrabold mt-1 text-[#3A2C18]">
                {loading ? "..." : stat.count}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mb-6">
          {["alumni", "events", "announcements"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                activeTab === tab
                  ? "bg-[#0E2346] text-white shadow-md"
                  : "bg-white/40 text-[#0E2346] hover:bg-[#0E2346]/20"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="glass-effect p-6 rounded-xl text-center text-[#4A3D31]">Loading recent data...</div>
        ) : (
          <div className="glass-effect p-6 rounded-xl shadow-xl">
            {/* Alumni – top 5, clickable */}
            {activeTab === "alumni" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-[#3A2C18]">
                  Top 5 Recent Alumni Registrations
                </h2>
                {alumniList.length === 0 ? (
                  <p className="text-[#4A3D31]">No alumni found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#D48C45]/50">
                      <thead>
                        <tr className="bg-[#3A2C18]/10 text-[#3A2C18]">
                          <th className="py-2 px-3 text-left text-sm font-semibold rounded-tl-lg">Photo</th>
                          <th className="py-2 px-3 text-left text-sm font-semibold">Name</th>
                          <th className="py-2 px-3 text-left text-sm font-semibold">Email</th>
                          <th className="py-2 px-3 text-left text-sm font-semibold rounded-tr-lg">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alumniList.map((a) => (
                          <tr
                            key={a._id}
                            className="border-t border-[#3A2C18]/20 cursor-pointer hover:bg-white/50 transition duration-150"
                            onClick={() => navigate(`/alumni/${a._id}`)}
                          >
                            <td className="p-3">
                              <img
                                src={a.image || upload_area}
                                alt={a.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#D48C45]"
                              />
                            </td>
                            <td className="p-3 font-medium text-[#3A2C18]">{a.name}</td>
                            <td className="p-3 text-sm text-[#4A3D31]">{a.email}</td>
                            <td className="p-3 text-sm text-[#5B4633]">{a.yearOfPassing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Events – top 5 */}
            {activeTab === "events" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-[#3A2C18]">
                  Top 5 Recent/Upcoming Events
                </h2>
                {eventsList.length === 0 ? (
                  <p className="text-[#4A3D31]">No events found</p>
                ) : (
                  <div className="space-y-3">
                    {eventsList.map((e) => (
                      <div
                        key={e._id}
                        className="glass-effect p-3 rounded-lg flex gap-4 items-start border-l-4 border-[#D48C45] hover:shadow-md transition duration-200"
                      >
                        <img
                          src={e.image || upload_area}
                          alt={e.title}
                          className="w-16 h-16 rounded object-cover border border-[#3A2C18]/20 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#3A2C18]">{e.title}</h3>
                          <div className="text-xs text-[#5B4633] mt-0.5">
                            {e.startDate && e.endDate && (
                              <p>
                                📅 {new Date(e.startDate).toLocaleDateString()} –{" "}
                                {new Date(e.endDate).toLocaleDateString()}
                              </p>
                            )}
                            {e.venue && (
                              <p>
                                📍 Venue: <span className="font-medium text-[#0E2346]">{e.venue}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                            onClick={() => navigate('/events')}
                            className="bg-[#0E2346] text-white px-3 py-1 text-xs rounded-full self-start hover:bg-[#0E2346]/90 transition cursor-pointer"
                        >
                            View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Announcements – top 5 */}
            {activeTab === "announcements" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-[#3A2C18]">
                  Top 5 Latest Announcements
                </h2>
                {announcementsList.length === 0 ? (
                  <p className="text-[#4A3D31]">No announcements found</p>
                ) : (
                  <div className="space-y-3">
                    {announcementsList.map((a) => (
                      <div
                        key={a._id}
                        className="glass-effect p-4 rounded-lg flex justify-between border-l-4 border-[#3A2C18] hover:shadow-md transition duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#3A2C18]">{a.title}</h3>
                          {a.date && (
                            <p className="text-xs text-[#5B4633] mt-0.5">
                              {new Date(a.date).toLocaleDateString()}
                            </p>
                          )}
                          {a.message && (
                            <p className="text-sm text-[#4A3D31] mt-1 line-clamp-2">
                              {a.message}
                            </p>
                          )}
                        </div>
                        <button
                            onClick={() => navigate('/announcements')}
                            className="bg-[#0E2346] text-white px-3 py-1 text-xs rounded-full self-start hover:bg-[#0E2346]/90 transition ml-4 cursor-pointer"
                        >
                            View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
