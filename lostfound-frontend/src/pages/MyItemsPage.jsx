import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/items/my-items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch user items:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Error deleting item");
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/items/${editingItem.id}`,
        editingItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data;
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingItem(null);
      alert("✅ Item updated successfully!");
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Error updating item");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading your items...
      </p>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>My Items</h2>

      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>You haven’t added any items yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
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
              <p>
                <strong>Status:</strong>{" "}
                {item.status === "RESOLVED" ? "✅ Resolved" : "❌ Open"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.dateOccurred).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                🗑️ Delete
              </button>

              <button
                onClick={() => setEditingItem(item)}
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                ✏️ Update Item
              </button>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            padding: "20px",
            width: "350px",
            zIndex: 1000,
          }}
        >
          <h3>Edit Item</h3>

          <label>Description:</label>
          <input
            type="text"
            value={editingItem.description}
            onChange={(e) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label>Location:</label>
          <input
            type="text"
            value={editingItem.location}
            onChange={(e) =>
              setEditingItem({ ...editingItem, location: e.target.value })
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label>
            <input
              type="checkbox"
              checked={editingItem.status === "RESOLVED"}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  status: e.target.checked ? "RESOLVED" : "OPEN",
                })
              }
            />
            &nbsp; Mark as Resolved
          </label>

          <div style={{ marginTop: "15px" }}>
            <button
              onClick={handleUpdate}
              style={{
                backgroundColor: "#2ecc71",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              💾 Save
            </button>
            <button
              onClick={() => setEditingItem(null)}
              style={{
                backgroundColor: "#7f8c8d",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyItemsPage;
