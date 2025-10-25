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

  // Initial fetch
  useEffect(() => {
    fetchItems(filterStatus);
  }, [filterStatus]);

  // Handle claim
  const handleClaim = (item) => {
    window.location.href = `mailto:${item.contactInfo}?subject=Claiming your found item: ${item.title}`;
  };

  // Client-side search + category filter
  const filteredItems = items.filter(
    (item) =>
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory ? item.category === filterCategory : true)
  );

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading items...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Found Items</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px", width: "250px" }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Keys">Keys</option>
          <option value="Wallets">Wallets</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No found items available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FoundItemsPage;
