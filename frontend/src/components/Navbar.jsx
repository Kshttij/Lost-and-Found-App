import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield, Map, Package, PlusCircle, User } from "lucide-react";

function Navbar({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    if (typeof setToken === "function") setToken(null);
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
          isActive 
            ? "bg-white/20 text-white shadow-sm" 
            : "text-indigo-100 hover:bg-white/10 hover:text-white"
        }`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-indigo-600 sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">L</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Lost&Found<span className="text-indigo-200 font-light">NITK</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/lost-items" icon={Map} label="Lost" />
            <NavLink to="/found-items" icon={Package} label="Found" />
            <NavLink to="/add-item" icon={PlusCircle} label="Post Item" />
            <NavLink to="/my-items" icon={User} label="My Items" />

            {userRole === "ADMIN" && (
              <Link
                to="/admin/users"
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-amber-900 rounded-lg font-bold hover:bg-amber-300 transition-colors ml-4 shadow-md"
              >
                <Shield size={18} />
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 ml-4 text-indigo-100 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-indigo-100 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
          <Link to="/lost-items" className="block text-indigo-100 hover:text-white px-3 py-2 rounded-md text-base font-medium">Lost Items</Link>
          <Link to="/found-items" className="block text-indigo-100 hover:text-white px-3 py-2 rounded-md text-base font-medium">Found Items</Link>
          <Link to="/add-item" className="block text-indigo-100 hover:text-white px-3 py-2 rounded-md text-base font-medium">Add Item</Link>
          <Link to="/my-items" className="block text-indigo-100 hover:text-white px-3 py-2 rounded-md text-base font-medium">My Items</Link>
          {userRole === "ADMIN" && (
            <Link to="/admin/users" className="block text-amber-300 font-bold px-3 py-2 rounded-md text-base">Admin Dashboard</Link>
          )}
          <button onClick={handleLogout} className="w-full text-left block text-red-200 hover:text-white px-3 py-2 rounded-md text-base font-medium">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;