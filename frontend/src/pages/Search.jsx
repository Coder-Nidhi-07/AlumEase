import React, { useState, useEffect } from "react";
import searchIcon from "../assets/searchIcon.png";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/alumni-search", {
        params: {
          q: query,
          year,
          course,
          page,
        },
      });

      setResults(res.data.results || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.log("Error searching students", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search whenever filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, year, course, page]);

  const clearSearch = () => {
    setQuery("");
    setYear("");
    setCourse("");
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <Container>
        <div className="flex flex-col md:flex-row">
          <Sidebar />

          {/* MAIN CONTENT */}
          <div className="flex flex-col w-full p-4 md:p-6">
            {/* Search Bar */}
            <div className="flex justify-center w-full">
              <div className="flex items-center border rounded-3xl w-full sm:w-2/3 lg:w-1/2 h-12 px-3 bg-white shadow-sm">
                <input
                  type="text"
                  className="flex-1 outline-none px-1 text-sm md:text-base"
                  placeholder="Search alumni by name..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
                <button
                  type="button"
                  onClick={fetchResults}
                  className="flex gap-2 text-sm md:text-base cursor-pointer"
                >
                  <img src={searchIcon} alt="" className="h-5 mt-1" />
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mt-5">
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className="border p-2 rounded w-36 sm:w-40"
              >
                <option value="">Year</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>

              <select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setPage(1);
                }}
                className="border p-2 rounded w-36 sm:w-40"
              >
                <option value="">Course</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
              </select>

              <button
                onClick={clearSearch}
                className="bg-gray-300 px-4 py-2 rounded-lg text-sm sm:text-base"
              >
                Clear
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <p className="text-center text-purple-600 mt-6">
                ⏳ Searching...
              </p>
            )}

            {/* Results */}
            <div className="mt-6 space-y-4">
              {!loading && results.length === 0 && (
                <p className="text-center text-gray-500">
                  No results found...
                </p>
              )}

              {results.map((alum) => (
                <div
                  key={alum._id}
                  className="border p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 gap-4"
                >
                  <div>
                    <h2 className="font-semibold text-lg">{alum.name}</h2>
                    <p className="text-sm">📧 {alum.email}</p>
                    <p className="text-sm">
                      🎓 Year: {alum.yearOfPassing || "N/A"}
                    </p>
                    {/* Backend uses 'courses' (array) */}
                    <p className="text-sm">
                      📘 Courses:{" "}
                      {Array.isArray(alum.courses) && alum.courses.length > 0
                        ? alum.courses.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => navigate(`/alumni/${alum._id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  page === 1 ? "bg-gray-200" : "bg-gray-300"
                }`}
              >
                Prev
              </button>
              <span className="mt-2 text-sm font-semibold">Page {page}</span>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  page * 10 >= total ? "bg-gray-200" : "bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Search;
