import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleButton = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google/login";
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        alert("Logout successful.");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        window.location.href = "/";
      }, 200);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        { login, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      alert(res.data.message);
      setLogin("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/";
      }, 200);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white shadow-md rounded-lg p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl text-gray-800 font-medium text-center">
          Login to your Account
        </h1>

        {/* Google Login */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoogleButton}
            className="flex items-center justify-center gap-2 w-full text-sm sm:text-base px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white transition"
          >
            <FaGoogle />
            Log in with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-600 text-sm uppercase">Or</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm">Email/Username</label>
            <input
              type="text"
              placeholder="Enter email or username"
              className="w-full mt-1 bg-gray-100 px-3 py-2 text-sm sm:text-base border border-orange-500 rounded outline-none focus:ring-1 focus:ring-orange-500"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 bg-gray-100 px-3 py-2 text-sm sm:text-base border border-orange-500 rounded outline-none focus:ring-1 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" className="cursor-pointer" />
              Remember me
            </label>

            <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded transition"
          >
            Log In
          </button>
        </form>

        {/* Signup */}
        <div className="text-sm text-gray-700 text-center mt-4">
          Don’t have an account?{" "}
          <NavLink to="/register" className="text-blue-500 hover:text-blue-600">
            Signup
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
