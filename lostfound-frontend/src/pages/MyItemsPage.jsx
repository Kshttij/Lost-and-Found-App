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
      <p className="text-center mt-20 text-gray-600 text-lg">
        Loading your items...
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        My Items
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t added any items yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 flex flex-col"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex justify-center items-center rounded-xl text-gray-400 italic">
                  No Image
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Type:</strong> {item.type}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Status:</strong>{" "}
                {item.status === "RESOLVED" ? (
                  <span className="text-green-600 font-medium">✅ Resolved</span>
                ) : (
                  <span className="text-red-600 font-medium">❌ Open</span>
                )}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Date:</strong>{" "}
                {new Date(item.dateOccurred).toLocaleString()}
              </p>

              <div className="mt-auto flex justify-center space-x-3">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  🗑️ Delete
                </button>

                <button
                  onClick={() => setEditingItem(item)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  ✏️ Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for editing item */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Item
            </h3>

            <label className="block text-sm font-medium mb-1">Description:</label>
            <input
              type="text"
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            />

            <label className="block text-sm font-medium mb-1">Location:</label>
            <input
              type="text"
              value={editingItem.location}
              onChange={(e) =>
                setEditingItem({ ...editingItem, location: e.target.value })
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
            />

            <label className="inline-flex items-center mb-4">
              <input
                type="checkbox"
                checked={editingItem.status === "RESOLVED"}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    status: e.target.checked ? "RESOLVED" : "OPEN",
                  })
                }
                className="mr-2 accent-green-500"
              />
              Mark as Resolved
            </label>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                💾 Save
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyItemsPage;
