import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Search from "../ui/Search";
import { BiSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import MenuBar from "../ui/MenuBar";
import CartIcon from "../ui/CartIcon";
import HeartIcon from "../ui/HearIcon";
import { useGetProfileQuery } from "../../redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import extractName from "../../utils/ExtractUserName";
import { FaCaretDown } from "react-icons/fa";
import truncateName from "../../utils/truncateName";
import UserProfileOption from "../ui/UserProfileOption";
import { useGetTotalCartItemQuery } from "../../redux/features/product/cartApi";

const NavBar = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const user = useSelector(selectCurrentUser);
  const { data } = useGetProfileQuery(undefined, { skip: !user }); // this will fetch the user profile only if logged in

  const { data: cartItems, isLoading } = useGetTotalCartItemQuery();

  const avatarImage = data?.data?.profile?.avatarUrl;
  const userName = extractName(data);

  useEffect(() => {
    const handleScroll = () => {
      return setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <div
      className={`sticky top-0 z-50 h-16 bg-white/30 backdrop-blur-3xl flex items-center justify-between px-2 lg:px-9  ${isScrolled ? "shadow-md " : "shadow-none"}`}
    >
      <div className=" flex items-center gap-4 ">
        <div
          className="md:hidden"
          onClick={() => setShowHamburgerMenu((prev) => !prev)}
        >
          {showHamburgerMenu ? <RxCross2 /> : <GiHamburgerMenu />}
        </div>

        <MenuBar
          showHamburgerMenu={showHamburgerMenu}
          setShowHamburgerMenu={setShowHamburgerMenu}
        />

        <NavLink to="/">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
            <span className="text-gray-800">KINMEL</span>
            <span className="text-orange-600">BAZAR</span>
          </h1>
        </NavLink>
      </div>

      <div className=" hidden md:block w-3xl">
        <Search />
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-3 lg:mr-6 md:hidden">
          <div className="bg-gray-300 hover:bg-gray-400 p-1.5 rounded-full">
            <BiSearch onClick={() => setToggleSearch(true)} />
          </div>
          {toggleSearch ? (
            <Search
              toggleSearch={toggleSearch}
              setToggleSearch={setToggleSearch}
            />
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center gap-5">
          <NavLink to="/cart">
            <CartIcon />
          </NavLink>

          <NavLink to="/WishList">
            <HeartIcon />
          </NavLink>

          {user ? (
            <div className="relative group flex items-center justify-center gap-1 ml-2 cursor-pointer">
              <div className="rounded-full h-9 w-9">
                <img
                  src={avatarImage}
                  alt=""
                  className="rounded-full object-cover"
                />
              </div>
              <div className="text-center flex gap-1 h-full">
                <div className="flex flex-col items-center justify-center mb-1">
                  <p className="text-[11px] font-light text-gray-800">
                    Welcome
                  </p>
                  <p className="text-sm font-light text-gray-800 leading-3">
                    {truncateName(userName, 10)}
                  </p>
                </div>
                <FaCaretDown
                  size={20}
                  className="text-gray-800 transition-transform duration-300 group-hover:rotate-180"
                />
              </div>
              <div className="absolute top-full left-0 w-full h-3" />

              {/* Dropdown */}
              <div
                className="absolute right-0 top-full mt-2 w-35 
              bg-white shadow-lg rounded-md z-50
                opacity-0 scale-95 pointer-events-none
                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                transition-all duration-200"
              >
                <UserProfileOption />
              </div>
            </div>
          ) : (
            <NavLink to="/login">
              <span className="text-sm bg-orange-600 hover:bg-orange-500 text-white py-1 px-2.5 rounded cursor-pointer transition-colors duration-150">
                Login
              </span>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
