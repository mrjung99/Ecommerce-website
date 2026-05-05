import { FaUserTie } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import useLogout from "../../hooks/useLogout";

const UserProfileOption = () => {
  const { logoutUser, isLoading } = useLogout();
  return (
    <div className="w-35 rounded-md overflow-hidden py-3">
      <p className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer transition flex items-center gap-3 justify-center">
        <FaUserTie size={17} /> Profile
      </p>

      <p
        onClick={logoutUser}
        className="w-ful px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 cursor-pointer transition flex items-center gap-3 justify-center"
      >
        <MdOutlineLogout size={21} /> Logout
      </p>
    </div>
  );
};

export default UserProfileOption;
