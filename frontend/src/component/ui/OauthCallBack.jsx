import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/auth/authSlice";

const OauthCallBack = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);

    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      dispatch(
        setCredentials({
          accessToken: token,
          user: { role },
        }),
      );

      window.history.replaceState(null, "", window.location.pathname);

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      alert("Login failed.");
    }
  }, []);
  return (
    <div className="h-lvh w-full flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
};

export default OauthCallBack;
