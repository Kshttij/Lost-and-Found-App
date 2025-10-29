import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
//import pic from "../../assets/pics/signup.png"; // make sure this path is correct

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setSuccess("Verification email has been sent to your email.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Registration failed:", err);
      setMessage("Registration failed! Please try again.");
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div
        className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        <div className="md:flex w-full">
          {/* Left Side - Image */}
          {/*<div className="hidden md:block w-1/2 bg-violet-900 py-10 px-10">
            <img src={pic} alt="Signup" className="w-full pt-20" />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">REGISTER</h1>
              <p>Enter your information to create an account</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-5">
                <label className="text-xs font-semibold px-1">Username</label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="text-xs font-semibold px-1">Email</label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="text-xs font-semibold px-1">Password</label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="************"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-5">
                <label className="text-xs font-semibold px-1">Select Role</label>
                <div className="flex">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              {/* Button */}
              <div className="mb-5">
                <button
                  type="submit"
                  className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                >
                  REGISTER NOW
                </button>
              </div>

              {/* Messages */}
              {message && (
                <p className="mt-2 text-center text-red-600">{message}</p>
              )}
              {success && (
                <p className="mt-2 text-center text-green-600">{success}</p>
              )}

              {/* Login Link */}
              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
