import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Component/Page Imports
import Navbar from "./components/Navbar";
import AddItemPage from "./pages/AddItemPage";
import LoginPage from "./pages/LoginPage";
import MyItemsPage from "./pages/MyItemsPage";
import LostItemsPage from "./pages/LostItemsPage";
import FoundItemsPage from "./pages/FoundItemsPage";
import Hero from "./pages/Hero";
import RegisterPage from "./pages/RegisterPage";


import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
// admin dashboard
import AdminUserManagementPage from "./pages/AdminUserManagementPage.jsx"; 



function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    // Listen for changes to local storage
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      {token && <Navbar setToken={setToken} />}

      <Routes>
        {/* --- Public Routes --- */}
        {/* Show Hero if logged out, redirect to main app if logged in */}
        <Route
          path="/"
          element={token ? <Navigate to="/lost-items" replace /> : <Hero />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/lost-items" replace /> : <LoginPage onLogin={(t) => setToken(t)} />}
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to="/lost-items" replace /> : <RegisterPage />} 
        />

        {/* ---  Protected Routes (All Logged-in Users) --- */}
        {/* The <ProtectedRoute> wrapper checks for a token. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/lost-items" element={<LostItemsPage />} />
          <Route path="/found-items" element={<FoundItemsPage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />

          {/* ---  Admin-Only Routes (Nested Inside) --- */}
          {/* The <AdminRoute> wrapper checks for "ADMIN" role. */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            {/* You can add more admin-only routes here */}
          </Route>
          {/* --- End Admin-Only Routes --- */}

        </Route>
        {/* --- End Protected Routes --- */}

      </Routes>
    </Router>
  );
}

export default App;