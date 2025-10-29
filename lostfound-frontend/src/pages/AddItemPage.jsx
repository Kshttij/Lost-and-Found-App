import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "LOST",
    dateOccurred: "",
    contactInfo: "",
    status: "OPEN",
  });

  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        const cloudData = new FormData();
        cloudData.append("file", imageFile);
        cloudData.append("upload_preset", "frontend_upload");
        cloudData.append("cloud_name", "diannkf5c");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/diannkf5c/image/upload",
          { method: "POST", body: cloudData }
        );
        const cloudResData = await cloudRes.json();
        imageUrl = cloudResData.secure_url;
      }

      const payload = {
        ...formData,
        imageUrl: imageUrl || "",
        category,
      };

      await axios.post("http://localhost:8080/api/items", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Item added successfully!");
      navigate("/lost-items");
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Add New Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Keys">Keys</option>
            <option value="Wallets">Wallets</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="datetime-local"
            name="dateOccurred"
            value={formData.dateOccurred}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Info (Email or Phone)"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;
