import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Container from "../components/Container";
import searchIcon from "../assets/searchIcon.png";
import logo from "../assets/logo.png";
import upload_area from "../assets/upload_area.svg";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const navigate = useNavigate();
  const [alumniCount, setAlumniCount] = useState(0);

  // 🟢 Fetch alumni from backend
  const fetchAlumni = async () => {
    try {
      const res = await API.get("/admin/alumni", {
        params: { page: 1, limit: 200 },
      });

      const list = res.data.alumni || [];
      setAlumni(list);
      setFilteredAlumni(list);
      setAlumniCount(list.length);
    } catch (error) {
      console.error("Failed to load alumni:", error);
    }
  };

  // 🔍 Apply filters
  const applyFilter = () => {
    let result = [...alumni];

    if (selectedBatch) {
      result = result.filter((a) => a.batch === selectedBatch);
    }

    if (selectedCourse) {
      result = result.filter(
        (a) =>
          Array.isArray(a.courses) &&
          a.courses.some((c) => c === selectedCourse)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q)
      );
    }

    setFilteredAlumni(result);
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [alumni, selectedBatch, selectedCourse, search]);

  // 🧩 Unique filters
  const uniqueBatches = Array.from(
    new Set(alumni.map((a) => a.batch).filter(Boolean))
  ).sort();

  const uniqueCourses = Array.from(
    new Set(
      alumni
        .flatMap((a) => (Array.isArray(a.courses) ? a.courses : []))
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-4 flex gap-4 max-w-7xl mx-auto">
          {/* LEFT SIDE */}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-[#3A2C18] mb-4 border-b-2 border-[#D48C45] pb-1">
              🎓 Alumni Directory
            </h1>

            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search alumni by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-effect p-2 pl-9 rounded-lg border border-[#D48C45]/50 focus:ring-2 focus:ring-[#D48C45] outline-none transition text-[#3A2C18] text-sm"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#3A2C18] text-lg">
                🔍
              </span>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className={`w-full cursor-pointer py-1.5 px-3 rounded-lg font-semibold transition-all md:hidden mb-3 ${
                showFilter
                  ? "bg-[#D48C45] text-white"
                  : "bg-[#3A2C18]/10 text-[#3A2C18] hover:bg-[#3A2C18]/20"
              }`}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              Filter Options ({selectedBatch || selectedCourse ? "Active" : "All"})
            </button>

            {/* Filters */}
            <div
              className={`flex-col gap-3 text-sm text-[#3A2C18] p-3 glass-effect rounded-lg mb-4 ${
                showFilter ? "flex" : "hidden md:flex"
              }`}
            >
              <h3 className="font-bold text-base mb-1 border-b border-[#D48C45]/50 pb-1">
                Refine Search
              </h3>

              {/* Batch */}
              <div>
                <p className="font-semibold mb-1">Filter by Batch</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedBatch("")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedBatch === ""
                        ? "bg-[#3A2C18] text-white shadow-md"
                        : "bg-[#D48C45]/20 text-[#3A2C18] hover:bg-[#D48C45]/40"
                    }`}
                  >
                    All
                  </button>
                  {uniqueBatches.map((batch) => (
                    <button
                      key={batch}
                      onClick={() =>
                        setSelectedBatch((prev) =>
                          prev === batch ? "" : batch
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        selectedBatch === batch
                          ? "bg-[#3A2C18] text-white shadow-md"
                          : "bg-[#D48C45]/20 text-[#3A2C18] hover:bg-[#D48C45]/40"
                      }`}
                    >
                      {batch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course */}
              <div className="mt-2">
                <p className="font-semibold mb-1">Filter by Course</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCourse("")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedCourse === ""
                        ? "bg-[#3A2C18] text-white shadow-md"
                        : "bg-[#D48C45]/20 text-[#3A2C18] hover:bg-[#D48C45]/40"
                    }`}
                  >
                    All
                  </button>
                  {uniqueCourses.map((course) => (
                    <button
                      key={course}
                      onClick={() =>
                        setSelectedCourse((prev) =>
                          prev === course ? "" : course
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        selectedCourse === course
                          ? "bg-[#3A2C18] text-white shadow-md"
                          : "bg-[#D48C45]/20 text-[#3A2C18] hover:bg-[#D48C45]/40"
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alumni Cards */}
            <div className="mt-4 w-full grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4">
              {filteredAlumni.length === 0 ? (
                <div className="glass-effect p-4 rounded-lg text-center text-[#4A3D31] col-span-full text-sm">
                  No alumni found for selected criteria.
                </div>
              ) : (
                filteredAlumni.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/alumni/${item._id}`)}
                    className="glass-effect rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {/* IMAGE WITH BLUR */}
                    <div className="relative w-full h-40 overflow-hidden rounded-t-xl bg-[#D4C4B1]">
                      <img
                        src={item.image || upload_area}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-40"
                      />
                      <img
                        src={item.image || upload_area}
                        alt={item.name}
                        className="relative z-10 w-full h-full object-contain"
                      />
                    </div>

                    <div className="p-3 bg-white/50">
                      <p className="text-[#3A2C18] text-base font-bold truncate">
                        {item.name}
                      </p>
                      <p className="text-[#4A3D31] text-xs font-medium">
                        {item.degree} • {item.department}
                      </p>
                      {item.batch && (
                        <p className="text-[#D48C45] text-[10px] mt-0.5">
                          Batch: {item.batch} | YOP: {item.yearOfPassing}
                        </p>
                      )}
                      {(item.currentCompany || item.position) && (
                        <p className="text-[#3A2C18] text-xs mt-1 truncate">
                          {item.position} {item.currentCompany && "@"}{" "}
                          <span className="font-semibold">
                            {item.currentCompany}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT STATS PANEL */}
          <div className="h-fit w-64 p-4 glass-effect rounded-xl border border-[#D48C45]/50 shadow-lg hidden lg:block sticky top-8">
            <img src={logo} alt="logo" className="h-7 mb-3 opacity-70" />

            <div className="border-t border-[#D48C45] pt-2">
              <p className="text-3xl font-extrabold text-[#D48C45]">
                {alumniCount}
              </p>
              <p className="font-semibold text-[#3A2C18] text-sm mb-3">
                Total Alumni
              </p>
            </div>

            <p className="text-[#4A3D31] text-xs mt-2">
              Connect with fellow graduates. Use the filters to find alumni by
              batch, course, or current profession.
            </p>

            <button
              onClick={() => navigate("/events")}
              className="w-full bg-[#D48C45] text-white px-3 py-1.5 text-sm mt-3 rounded-lg font-semibold hover:bg-[#C27931] transition duration-300 shadow-md"
            >
              View Upcoming Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Directory;
