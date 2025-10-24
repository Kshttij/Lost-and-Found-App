// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Send 'name' instead of 'username' to match backend User entity
      const res = await axios.post("http://localhost:8080/api/users/register", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log("Register success:", res.data);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
      alert("Registration failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />

        {/* ✅ Role dropdown */}
        <label htmlFor="role">Select Role: </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")}>Login here</button>
      </p>
    </div>
  );
}

export default RegisterPage;
