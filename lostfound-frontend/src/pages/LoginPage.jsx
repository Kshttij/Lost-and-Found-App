import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// import pic from "../assets/login-illustration.png"; // 🖼️ replace with your image path

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Invalid email";

    // ✅ Only check if password is empty, no length restriction
    if (!password) formErrors.password = "Password is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      if (typeof onLogin === "function") onLogin(token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-5 py-5">
      <div className="bg-gray-100 text-gray-700 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl">
        <div className="md:flex w-full">
          {/* Left Image Section */}
          <div className="hidden md:flex md:w-1/2 bg-indigo-900 items-center justify-center p-10">
            {/* You can add your image or SVG here later */}
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 py-10 px-6 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">LOGIN</h1>
              <p className="text-gray-500 mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-400"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-200"
              >
                Login
              </button>

              {/* Message */}
              {message && (
                <p className="mt-3 text-center text-red-600 text-sm">{message}</p>
              )}

              {/* Register Link */}
              <p className="text-sm text-center text-gray-600 mt-5">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
