import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ItemCard from "../components/ItemCard";

function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const fetchItems = async (type = "", status = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const params = {};
      if (type) params.type = type.toUpperCase();
      if (status) params.status = status.toUpperCase();

      const res = await axios.get("http://localhost:8080/api/items", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems(filterType, filterStatus);
  }, [filterType, filterStatus]);

  const filteredItems = items.filter(
    item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading items...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Lost & Found Items</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "5px", width: "250px" }}
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onClaim={() => fetchItems(filterType, filterStatus)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
