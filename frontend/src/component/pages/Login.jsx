import axios from "axios";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleButton = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google/login";
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No accessToken found.");
      return;
    }

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

        window.location.href = "http://localhost:5173";
      }
    } catch (error) {
      console.error("Logout failed: ", error.response.data || error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);

      setTimeout(() => {
        window.location.href = "http://localhost:5173";
      }, 200);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-lvh">
      <h1 className="text-4xl mb-6">Login to your account</h1>
      <button
        className="cursor-pointer bg-amber-400 text-white text-2xl p-2 px-5 rounded-2xl"
        onClick={handleButton}
      >
        Login with google
      </button>

      <button
        className="cursor-pointer bg-amber-600 text-white text-2xl p-2 px-5 rounded-2xl"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Login;
