import { Navigate, NavLink, replace, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import {
  selectCurrentUser,
  selectIsInitialized,
  setCredentials,
} from "../../redux/features/auth/authSlice";
import { useState } from "react";
import Loader from "../ui/Loader";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authLogin, { isLoading, isError }] = useLoginMutation();

  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) <Loader />;

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authLogin({ login, password }).unwrap();
      dispatch(setCredentials(data));
      redirectByRole(data.user.role, navigate);
      console.log("Login successful.");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const redirectByRole = (role, navigate) => {
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] mb-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white shadow-md rounded-lg p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl text-gray-800 font-medium text-center">
          Login to your Account
        </h1>

        {/* Google Login */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full text-sm sm:text-base px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer"
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
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded transition cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Signup */}
        <div className="text-sm text-gray-700 text-center mt-4">
          Don’t have an account?
          <NavLink to="/register" className="text-blue-500 hover:text-blue-600">
            Signup
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
