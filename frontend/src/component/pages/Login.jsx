import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleButton = () => {
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
    <div className="min-h-[82vh] max-w-4/12 mx-auto py-10 flex items-center justify-center">
      <div className="bg-white shadow-[0_0_2px_rgba(0,0,0,0.3)] py-8 px-10 w-full">
        <h1 className="text-2xl text-gray-800 font-medium  text-center font-sans">
          Login to your Account
        </h1>
        <div className="mt-8 space-y-4">
          <form action="" className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 text-sm">
                Email/Username:
              </label>
              <input
                type="email"
                placeholder="Email..."
                name="email"
                id="email"
                className="bg-gray-100 px-3 py-2 font-sans text-sm border
                            border-orange-600 focus:shadow-[inset_0_0_4px_rgba(249,115,22,0.4)]
                            rounded outline-0"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 text-sm">
                Password:
              </label>
              <div className="relative">
                <input
                  // type={togglePassword ? "text" : "password"}
                  placeholder="Password..."
                  name="password"
                  id="password"
                  className="w-full bg-gray-100 px-3 py-2 font-sans 
                  text-sm border border-orange-600 focus:shadow-[inset_0_0_4px_rgba(249,115,22,0.4)] rounded outline-0"
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />

                <button
                  className="absolute top-1/2 transform -translate-y-1/2 right-2 text-gray-700 hover:text-gray-800 cursor-pointer"
                  // onClick={handleShowHidePassword}
                >
                  {/* {togglePassword ? <FaEyeSlash /> : <FaEye />} */}
                </button>
              </div>
            </div>
            <div className="flex gap-15 items-center justify-between text-sm">
              <div className="text-gray-700 font-sans flex items-center gap-1">
                <input type="checkbox" className="cursor-pointer" />
                <span>Remember me</span>
              </div>
              <span className="text-blue-500 hover:text-blue-600 font-sans cursor-pointer transition-all duration-300 ease">
                Forgot Password?
              </span>
            </div>
            <button
              className="bg-orange-600 hover:bg-orange-500 text-gray-100 
                        font-sans py-1 px-4 rounded cursor-pointer mt-2 w-full transition-all 
                        duration-300 ease"
              // onClick={handleLogin}
            >
              Log In
            </button>
          </form>
          <div className="font-sans text-sm text-gray-700">
            <span>
              Don't have account?
              <NavLink to="/register">
                <span className="text-blue-500 hover:text-blue-600 font-sans cursor-pointer transition-all duration-300 ease">
                  Signup
                </span>
              </NavLink>
            </span>
          </div>
        </div>

        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-700 text-sm font-medium uppercase">
            Or
          </span>
          <div className="grow border-t border-gray-400"></div>
        </div>

        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 font-sans text-sm px-3 py-1 rounded cursor-pointer
                    bg-orange-600 hover:bg-orange-500 text-gray-100 transition-all duration-300 ease"
            onClick={handleGoogleButton}
          >
            {/* <FaGoogle /> */}
            Log in with Goggle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
