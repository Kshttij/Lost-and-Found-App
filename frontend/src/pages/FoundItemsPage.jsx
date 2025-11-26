import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig"; 
import { Search, Filter, Loader2 } from "lucide-react";
import ItemCard from "../components/ItemCard";

function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // --- REFACTORED FETCH FUNCTION ---
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { type: "FOUND" };
      
      // Add filters to params if they exist
      if (filterStatus) params.status = filterStatus.toUpperCase();
      if (filterCategory) params.category = filterCategory; // <--- NEW: Server-side filtering

      const res = await axiosInstance.get("/items", { params });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch found items:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory, navigate]);

  // Trigger fetch whenever filters change
  useEffect(() => { 
    fetchItems(); 
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item.");
    }
  };

  const handleResolve = async (id) => {
    const itemToUpdate = items.find((i) => i.id === id);
    if (!itemToUpdate) return;
    if (!window.confirm("Mark this item as RESOLVED?")) return;
    try {
      const updatedItem = { ...itemToUpdate, status: "RESOLVED" };
      await axiosInstance.put(`/items/${id}`, updatedItem);
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      alert("Item marked as resolved!");
    } catch (err) {
      console.error("Resolve failed:", err);
      alert("Failed to update status.");
    }
  };

  const handleClaim = (item) => {
    window.location.href = `mailto:${item.contactInfo}?subject=Claiming your found item: ${item.title}`;
  };

  // --- CLIENT-SIDE SEARCH ONLY ---
  // Category logic removed, backend handles it.
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
           <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Found Items</h2>
           <p className="mt-2 text-lg text-gray-500">Items found and reported. Is one of these yours?</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-gray-400"/></div>
             <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
             <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <Filter size={16} className="text-gray-500"/>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer">
                  <option value="">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
             </div>
             <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer">
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Keys">Keys</option>
                  <option value="Wallets">Wallets</option>
                  <option value="Other">Other</option>
                </select>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-emerald-600" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-xl text-gray-400 font-medium">No found items match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onClaim={handleClaim}
                onDelete={handleDelete} 
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoundItemsPage;