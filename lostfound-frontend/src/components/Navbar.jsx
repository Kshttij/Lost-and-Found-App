import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token everywhere and update App state
    localStorage.removeItem("token");
    if (typeof setToken === "function") setToken(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>Lost & Found</div>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          🏠 Dashboard
        </Link>
        <Link to="/add-item" style={{ color: "white", textDecoration: "none" }}>
          ➕ Add Item
        </Link>

        <Link to="/my-items" style={{ color: "white", textDecoration: "none" }}>
  📦 My Items
</Link>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
