import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AddItemPage from "./pages/AddItemPage";
import LoginPage from "./pages/LoginPage";
import MyItemsPage from "./pages/MyItemsPage";
import LostItemsPage from "./pages/LostItemsPage";
import FoundItemsPage from "./pages/FoundItemsPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      {token && <Navbar setToken={setToken} />}

      <Routes>
        <Route path="/" element={<Navigate to={token ? "/lost-items" : "/login"} replace />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/lost-items" replace /> : <LoginPage onLogin={(t) => setToken(t)} />}
        />
        <Route path="/lost-items" element={token ? <LostItemsPage /> : <Navigate to="/login" replace />} />
        <Route path="/found-items" element={token ? <FoundItemsPage /> : <Navigate to="/login" replace />} />
        <Route path="/add-item" element={token ? <AddItemPage /> : <Navigate to="/login" replace />} />
        <Route path="/my-items" element={token ? <MyItemsPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
