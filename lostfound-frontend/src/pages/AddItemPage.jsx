import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "LOST", // default
    dateOccurred: "",
    contactInfo: "",
    status: "OPEN", // default
  });

  const [category, setCategory] = useState(""); // ✅ new state for category
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setLoading(false); // user is authenticated, show the page
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit form
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

      // ✅ Upload image to Cloudinary (if provided)
      if (imageFile) {
        const cloudData = new FormData();
        cloudData.append("file", imageFile);
        cloudData.append("upload_preset", "frontend_upload"); // your preset
        cloudData.append("cloud_name", "diannkf5c"); // your cloud name

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/diannkf5c/image/upload",
          { method: "POST", body: cloudData }
        );

        const cloudResData = await cloudRes.json();
        imageUrl = cloudResData.secure_url;
      }

      // ✅ Send item data to backend
      const payload = {
        ...formData,
        imageUrl: imageUrl || "",
        category, // include category
      };

      await axios.post("http://localhost:8080/api/items", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Item added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    }
  };

  if (loading) return null; // do not render page until authentication is checked

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add New Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        {/* ✅ Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="contactInfo"
          placeholder="Contact Info (Email or Phone)"
          value={formData.contactInfo}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItemPage;
