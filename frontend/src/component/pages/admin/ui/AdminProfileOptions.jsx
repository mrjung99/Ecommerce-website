import React from "react";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import useLogout from "../../../../hooks/useLogout";

const AdminProfileOptions = () => {
  const { logoutUser, isLoading } = useLogout();
  return (
    <div className="w-40 bg-gray-800 rounded-md overflow-hidden py-3">
      <p className="w-full px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition flex items-center gap-3 justify-center">
        <FaUserTie size={17} /> Profile
      </p>

      <p
        onClick={logoutUser}
        className="w-ful px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition flex items-center gap-3 justify-center"
      >
        <MdOutlineLogout size={21} /> Logout
      </p>
    </div>
  );
};

export default AdminProfileOptions;
