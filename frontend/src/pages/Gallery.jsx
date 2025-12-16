import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { toast } from "react-toastify";
import "../App.css"; // Ensure your glass-effect is imported here

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/gallery/all");
      setGalleryItems(res.data.galleryItems);
    } catch (error) {
      console.error("Failed to fetch gallery items", error);
      toast.error("Failed to load gallery.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }

    // NOTE: Sending the full Base64 string in the request body, 
    // ensure your backend handles large payloads.
    const formData = {
      image: previewImage, // Base64 string
      description,
    };

    try {
      const res = await API.post("/gallery/add", formData);
      toast.success(res.data.message);
      setDescription("");
      setImage(null);
      setPreviewImage(null);
      fetchGalleryItems();
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error(error.response?.data?.message || "Failed to upload image.");
    }
  };

  const role = localStorage.getItem("role");

  return (
    // Applied background color to the main container
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="p-8 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#3A2C18] mb-6 border-b-2 border-[#D48C45] pb-2">
          📸  Gallery
        </h2>

        {/* Admin Upload Form */}
        {role === "admin" && (
          // Applied glass effect and shadow
          <div className="glass-effect shadow-xl rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold text-[#3A2C18] mb-4">
              Upload New Campus/Event Photo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="galleryImage"
                  className="block text-sm font-medium text-[#3A2C18] mb-2"
                >
                  Image File
                </label>
                <input
                  type="file"
                  id="galleryImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  // Styled input file for professional look
                  className="mt-1 block w-full text-sm text-[#3A2C18] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0E2346]/20 file:text-[#3A2C18] hover:file:bg-[#0E2346]/40 transition duration-200"
                />
                {previewImage && (
                  <div className="mt-4 p-3 glass-effect rounded-lg bg-white/50 border border-[#0E2346]/50 max-w-sm mx-auto">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-48 object-contain mx-auto rounded-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#3A2C18]"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  // Styled textarea with theme colors
                  className="mt-1 block w-full glass-effect border border-[#0E2346]/50 rounded-lg shadow-sm p-2 focus:ring-[#0E2346] focus:border-[#0E2346] outline-none text-[#3A2C18]"
                  placeholder="Describe the moment or event..."
                ></textarea>
              </div>
              <button
                type="submit"
                // Styled button with dark primary color
                className="bg-[#0E2346] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0E2346]/90 transition duration-300 shadow-md cursor-pointer"
              >
                Upload Image
              </button>
            </form>
          </div>
        )}

        {/* Gallery List */}
        <div className="glass-effect shadow-xl rounded-xl p-6">
          <h3 className="text-2xl font-bold text-[#3A2C18] mb-4">
            All Gallery Images
          </h3>
          {isLoading ? (
            <p className="text-[#4A3D31] text-center">Loading images...</p>
          ) : galleryItems.length === 0 ? (
            <p className="text-[#4A3D31] text-center">
              No images in the gallery yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  // Applied subtle styling for grid items
                  className="rounded-xl overflow-hidden shadow-lg border border-[#D48C45]/20 hover:shadow-2xl transition duration-300 transform hover:-translate-y-0.5"
                >
                  <img
                    src={item.image}
                    alt={item.description}
                    // Adjusted image height slightly for cleaner grid
                    className="w-full h-44 object-cover bg-gray-200" 
                  />
                  <div className="p-3 bg-white/60">
                    {item.description && (
                      <p className="text-sm font-medium text-[#3A2C18] line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[#5B4633] opacity-80">
                      By: University Adminstration
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;