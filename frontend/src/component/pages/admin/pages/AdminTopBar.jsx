import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useLogout from "../../../../hooks/useLogout";
import AdminProfileOptions from "../ui/AdminProfileOptions";
import { IoCaretDownSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectProfile,
} from "../../../../redux/features/auth/authSlice";
import { useGetProfileQuery } from "../../../../redux/features/auth/authApi";
import extractName from "../../../../utils/ExtractUserName";
import truncateName from "../../../../utils/truncateName";

const AdminTopBar = ({
  toggleSidebar,
  sidebarOpen,
  toggleCollapse,
  collapsed,
}) => {
  const [dark, setDark] = useState(true);
  const user = useSelector(selectCurrentUser);
  const { data } = useGetProfileQuery(undefined, { skip: !user });

  const userName = extractName(data);
  const avatarImage = data?.data?.profile?.avatarUrl;

  const handleDarkMode = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* Left */}
      <div className="flex items-center justify-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-xl text-gray-200 cursor-pointer"
        >
          {sidebarOpen ? <RxCross1 /> : <GiHamburgerMenu />}
        </button>

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="hidden px-3 md:flex text-gray-100 cursor-pointer  md:items-center md:justify-center hover:scale-110"
        >
          <IoIosArrowForward
            size={23}
            className={`absolute transition-all duration-300 ease-in-out 
        ${collapsed ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}
        `}
          />

          <MdArrowBackIos
            size={20}
            className={`absolute transition-all duration-300 ease-in-out
        ${collapsed ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}
        `}
          />
        </button>

        <h1 className="md:text-2xl font-bold text-gray-200">
          KINMEL<span className="text-orange-600">BAZAR</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex justify-end items-center gap-7">
        {/* Dark Mode Toggle */}
        <button
          onClick={handleDarkMode}
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          <MdLightMode
            size={25}
            className={`absolute transition-all duration-300 ease-in-out
              ${dark ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}
            text-gray-400`}
          />

          <MdDarkMode
            size={25}
            className={`absolute transition-all duration-300 ease-in-out
              ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}
            text-gray-400`}
          />
        </button>

        {/* Profile Section */}
        <div className="relative flex items-center gap-3 cursor-pointer group">
          {/* Profile Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-400 rounded-full overflow-hidden">
              <img src={avatarImage} alt="" />
            </div>

            <div className="hidden sm:block text-center">
              <p className="text-gray-200 font-thin text-sm leading-5">
                {truncateName(userName, 10)}
              </p>
              <p className="text-gray-400 text-xs">Admin</p>
            </div>

            <IoCaretDownSharp
              size={18}
              className="text-gray-400 transition-transform duration-300 group-hover:rotate-180"
            />
          </div>

          {/* Invisible hover bridge (IMPORTANT) */}
          <div className="absolute top-full left-0 w-full h-3" />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-2 w-40 
    bg-white dark:bg-gray-800 shadow-lg rounded-md z-50
    opacity-0 scale-95 pointer-events-none
    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
    transition-all duration-200"
          >
            <AdminProfileOptions />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTopBar;
