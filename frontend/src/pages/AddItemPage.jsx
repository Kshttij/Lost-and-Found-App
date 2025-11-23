import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; // Updated import
import { UploadCloud, Save, Loader2 } from "lucide-react";

function AddItemPage() {
  const [formData, setFormData] = useState({
    title: "", description: "", location: "", type: "LOST", dateOccurred: "", contactInfo: "", status: "OPEN",
  });
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else setPageLoading(false);
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return alert("Please select a category.");
    
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        // KEEP THIS AS FETCH - It goes to Cloudinary, NOT your backend
        const cloudData = new FormData();
        cloudData.append("file", imageFile);
        cloudData.append("upload_preset", "frontend_upload");
        cloudData.append("cloud_name", "diannkf5c");
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/diannkf5c/image/upload", { method: "POST", body: cloudData });
        const cloudResData = await cloudRes.json();
        imageUrl = cloudResData.secure_url;
      }

      // Updated to use axiosInstance
      await axiosInstance.post("/items", { ...formData, imageUrl: imageUrl || "", category });

      alert("Item added successfully!");
      navigate(formData.type === "LOST" ? "/lost-items" : "/found-items");
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6">
           <h2 className="text-2xl font-bold text-white">Post New Item</h2>
           <p className="text-indigo-100 mt-1">Fill in the details to report a lost or found item.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Title */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Blue Wallet" />
             </div>

             {/* Description */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Provide details like color, brand, unique marks..." />
             </div>

             {/* Type */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                </select>
             </div>

             {/* Category */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Keys">Keys</option>
                  <option value="Wallets">Wallets</option>
                  <option value="Other">Other</option>
                </select>
             </div>

             {/* Location */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Library 2nd Floor" />
             </div>

             {/* Date */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input type="datetime-local" name="dateOccurred" value={formData.dateOccurred} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
             </div>

             {/* Contact */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email or Phone Number" />
             </div>

             {/* Image Upload */}
             <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 800x400px)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                {imageFile && <p className="text-sm text-green-600 mt-2 text-center">Selected: {imageFile.name}</p>}
             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Submit Item</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemPage;