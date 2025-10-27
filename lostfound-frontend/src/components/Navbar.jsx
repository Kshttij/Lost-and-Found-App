import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof setToken === "function") setToken(null);
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-2xl font-bold tracking-wide">
          Lost & Found
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            to="/lost-items"
            className="hover:text-green-200 transition-colors duration-200"
          >
            🆘 Lost Items
          </Link>
          <Link
            to="/found-items"
            className="hover:text-green-200 transition-colors duration-200"
          >
            🔍 Found Items
          </Link>
          <Link
            to="/add-item"
            className="hover:text-green-200 transition-colors duration-200"
          >
            ➕ Add Item
          </Link>
          <Link
            to="/my-items"
            className="hover:text-green-200 transition-colors duration-200"
          >
            📦 My Items
          </Link>

          <button
            onClick={handleLogout}
            className="bg-white text-green-700 font-semibold px-3 py-1 rounded-md hover:bg-green-100 transition duration-200"
          >
            🚪 Logout
          </button>
        </div>

        {/* Mobile Menu Placeholder (optional for future) */}
        <div className="md:hidden">
          <button className="focus:outline-none text-white">
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
