import React from "react";
import { FaBagShopping } from "react-icons/fa6";

const ShopNowButton = () => {
  return (
    <button className="relative -top-20 z-40 lg:absolute lg:left-20 lg:top-75 flex items-center gap-3 bg-orange-600 text-lg text-gray-200 px-3 py-1 rounded-md  w-fit hover:bg-orange-500 cursor-pointer transition-all duration-100">
      <FaBagShopping />
      <span>Shop Now</span>
    </button>
  );
};

export default ShopNowButton;
