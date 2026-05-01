import React from "react";
import { NavLink } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="hidden md:flex gap-5 py-2 w-11/12 mx-auto font-sans">
      <ul className=" flex gap-3 text-[12px] text-gray-600">
        <div>
          <NavLink to="/">
            <li className="flex gap-3 text-[12px] text-gray-600">Home</li>
          </NavLink>
        </div>

        <div>
          <NavLink to="/about">
            <li className="flex gap-3 text-[12px] text-gray-600">About us</li>
          </NavLink>
        </div>

        <div>
          <li className="flex gap-3 text-[12px] text-gray-600">My account</li>
        </div>

        <div>
          <li className="flex gap-3 text-[12px] text-gray-600">
            Order Tracking
          </li>
        </div>
      </ul>
    </div>
  );
};

export default TopBar;
