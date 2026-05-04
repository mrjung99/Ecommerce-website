import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/features/auth/authApi";
import { clearCredentials } from "../redux/features/auth/authSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const logoutUser = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  return { logoutUser, isLoading };
};

export default useLogout;
