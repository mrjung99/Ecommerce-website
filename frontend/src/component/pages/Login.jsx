import React, { useEffect } from "react";

const Login = () => {
  const handleButton = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google/login";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      console.log("accessToken", accessToken);
      window.location.href = "http://localhost:5173";
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
    </div>
  );
};

export default Login;
