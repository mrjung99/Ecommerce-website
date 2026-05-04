// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../redux/features/auth/authSlice";
import Loader from "../component/ui/Loader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
}
