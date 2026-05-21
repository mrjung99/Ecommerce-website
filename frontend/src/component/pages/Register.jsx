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
import { toast } from "react-toastify";

const Register = () => {
  const [registerUser, setRegisterUser] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authLogin, { isLoading, isError }] = useLoginMutation();

  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) <Loader />;

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  const handleGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // const data = await authLogin({ login, password }).unwrap();
      // dispatch(setCredentials(data));
      // redirectByRole(data.user.role, navigate);
      console.log("signup: ", registerUser);

      toast.success("Successfully logged in.");
    } catch (error) {
      toast.error(error.data.message || "Invalid credentials.");
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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-md bg-white shadow-md rounded-lg p-4 sm:p-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl text-gray-800 font-medium text-center">
          Create your Account
        </h1>

        {/* Google Login */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center gap-2 w-full text-sm sm:text-base px-4 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer"
          >
            <FaGoogle />
            Sign up with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-3">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-600 text-sm uppercase">Or</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="sm:space-y-5">
          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm">Username</label>
            <input
              type="text"
              placeholder="Enter email or username"
              className="w-full mt-1 bg-gray-100 px-3 py-1 text-sm text-gray-800 sm:text-base border border-orange-500 rounded outline-none focus:ring-1 focus:ring-orange-500"
              value={registerUser.userName}
              onChange={(e) =>
                setRegisterUser((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm">Email</label>
            <input
              type="text"
              placeholder="Enter email or username"
              className="w-full mt-1 bg-gray-100 px-3 py-1 text-sm text-gray-800 sm:text-base border border-orange-500 rounded outline-none focus:ring-1 focus:ring-orange-500"
              value={registerUser.email}
              onChange={(e) =>
                setRegisterUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 bg-gray-100 px-3 py-1 text-sm text-gray-800 sm:text-base border border-orange-500 rounded outline-none focus:ring-1 focus:ring-orange-500"
              value={registerUser.password}
              onChange={(e) =>
                setRegisterUser((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded transition cursor-pointer mt-5"
          >
            {isLoading ? "Creating..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
