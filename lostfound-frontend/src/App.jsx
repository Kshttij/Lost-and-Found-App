import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import AddItemPage from "./pages/AddItemPage";
import LoginPage from "./pages/LoginPage";
import MyItemsPage from "./pages/MyItemsPage";

function App() {
  // reactive token state
  const [token, setToken] = useState(localStorage.getItem("token"));

  // keep token in sync if changed in another tab (optional)
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      {/* show Navbar only when logged in */}
      {token && <Navbar setToken={setToken} />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />

        {/* Login page receives callback to set token */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={(t) => setToken(t)} />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-item"
          element={token ? <AddItemPage /> : <Navigate to="/login" replace />}
        />

        <Route
  path="/my-items"
  element={token ? <MyItemsPage /> : <Navigate to="/login" replace />}
/>
        
      </Routes>
    </Router>
  );
}

export default App;
