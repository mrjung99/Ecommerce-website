import React from "react";
import { NavLink } from "react-router-dom";

const MenuBar = ({ showHamburgerMenu, setShowHamburgerMenu }) => {
  return (
    <div
      className={`
         absolute top-15 left-0 w-full h-screen z-50 overflow-auto
        bg-white transition-all duration-300 ease-in-out md:hidden
        ${
          showHamburgerMenu
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full pointer-events-none"
        }
      `}
    >
      <ul className="flex mt-10 flex-col items-center text-2xl space-y-4">
        <NavLink to="/" onClick={() => setShowHamburgerMenu(false)}>
          <li>Home</li>
        </NavLink>

        <NavLink to="/aboutUs" onClick={() => setShowHamburgerMenu(false)}>
          <li>About us</li>
        </NavLink>

        <NavLink to="/account" onClick={() => setShowHamburgerMenu(false)}>
          <li>My account</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default MenuBar;
