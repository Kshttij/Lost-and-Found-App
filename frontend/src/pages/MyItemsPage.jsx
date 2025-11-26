import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; 
import { Trash2, Edit2, Save, X, Loader2 } from "lucide-react";

function MyItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
       
        const res = await axiosInstance.get("/items/my-items");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch user items:", err);
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      // Updated to use axiosInstance
      await axiosInstance.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) { alert("Error deleting item"); }
  };

  const handleUpdate = async () => {
    try {
      // Updated to use axiosInstance
      const res = await axiosInstance.put(`/items/${editingItem.id}`, editingItem);
      const updated = res.data;
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingItem(null);
      alert(" Item updated successfully!");
    } catch (err) { alert("Error updating item"); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Posted Items</h2>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">You haven't posted any items yet.</p>
            <button onClick={() => navigate('/add-item')} className="mt-4 text-indigo-600 font-semibold hover:underline">Post an item now</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 w-full bg-gray-100 relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${item.status === 'RESOLVED' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {item.status}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setEditingItem(item)} className="flex-1 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <Edit2 size={16} className="mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-sm font-semibold transition-colors">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Edit Item</h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={editingItem.location} onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                   <input type="checkbox" id="statusCheck" checked={editingItem.status === "RESOLVED"} onChange={(e) => setEditingItem({ ...editingItem, status: e.target.checked ? "RESOLVED" : "OPEN" })} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                   <label htmlFor="statusCheck" className="text-sm font-medium text-gray-700">Mark as Resolved</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"><Save size={18}/> Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyItemsPage;