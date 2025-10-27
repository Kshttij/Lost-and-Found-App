import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";

function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const navigate = useNavigate();

  // Auth check on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Fetch found items
  const fetchItems = async (status = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const params = { type: "FOUND" };
      if (status) params.status = status.toUpperCase();

      const res = await axios.get("http://localhost:8080/api/items", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch found items:", err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Initial + status-based fetch
  useEffect(() => {
    fetchItems(filterStatus);
  }, [filterStatus]);

  // Handle claim (email link)
  const handleClaim = (item) => {
    window.location.href = `mailto:${item.contactInfo}?subject=Claiming your found item: ${item.title}`;
  };

  // Client-side search + filter
  const filteredItems = items.filter(
    (item) =>
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory ? item.category === filterCategory : true)
  );

  if (loading)
    return (
      <p className="text-center mt-16 text-gray-600 text-lg font-medium">
        Loading items...
      </p>
    );

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Found Items
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-64"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Keys">Keys</option>
          <option value="Wallets">Wallets</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No found items available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FoundItemsPage;
