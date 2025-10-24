import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ItemCard component
function ItemCard({ item }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          No Image
        </div>
      )}

      <h3 style={{ marginTop: "10px" }}>{item.title}</h3>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Date:</strong> {new Date(item.dateOccurred).toLocaleString()}</p>
      <p><strong>Contact:</strong> {item.contactInfo}</p>
      <p><strong>Status:</strong> {item.status}</p>
    </div>
  );
}

function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  // 1) Auth check on mount — if no token, do a single navigate
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // single navigation, will unmount this component normally
      navigate("/login");
    }
  }, [navigate]);

  // 2) fetchItems only if token exists
  const fetchItems = async (type = "", status = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // ensure we don't stay in loading state
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
      // clear token and redirect (user's session probably invalid)
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch (runs only once)
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when filters change
  useEffect(() => {
    fetchItems(filterType, filterStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus]);

  // client-side search
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading items...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Lost & Found Items</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
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

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>                                  
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
