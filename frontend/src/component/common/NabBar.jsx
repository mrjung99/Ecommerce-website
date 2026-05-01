import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Search from "../ui/Search";
import { BiSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import MenuBar from "../ui/MenuBar";
import CartIcon from "../ui/CartIcon";
import HeartIcon from "../ui/HearIcon";

const NabBar = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  useEffect(() => {
    document.body.style.overflow = showHamburgerMenu ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showHamburgerMenu]);

  return (
    <div className="sticky top-0 z-50 h-16 bg-white/30 backdrop-blur-xl flex shadow-sm items-center justify-between px-2 lg:px-9">
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
            <span>KINMEL</span>
            <span className="text-orange-600">BAZAR</span>
          </h1>
        </NavLink>
      </div>

      <div className=" hidden md:block w-4xl">
        <Search />
      </div>

      <div className="flex gap-3">
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

        <div className="flex items-center gap-4">
          <CartIcon />
          <HeartIcon />
          <NavLink to="/login">
            <span className="text-sm bg-orange-600 hover:bg-orange-500 text-white py-1 px-2.5 rounded cursor-pointer transition-colors duration-150">
              Login
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NabBar;
