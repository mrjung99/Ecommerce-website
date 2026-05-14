import React from "react";
import { LuHeartOff } from "react-icons/lu";
import { FiArrowLeft } from "react-icons/fi";

import { NavLink } from "react-router-dom";
import ProductCard from "../ui/ProductCard";

const Wishlist = () => {
  // if (totalWishList <= 0) {
  //   return (
  //     <div className="min-h-[80vh] flex flex-col items-center justify-center">
  //       <LuHeartOff className="text-8xl text-gray-300 mb-6" />
  //       <h1 className="text-xl font-bold text-gray-700 mb-4">
  //         Your wishlist is empty
  //       </h1>
  //       <p className="text-gray-500 mb-8 text-sm text-center max-w-md">
  //         Save items you love for later. Click the heart icon on any product.
  //       </p>
  //       <NavLink
  //         to="/product"
  //         className="px-8 py-3 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 flex items-center gap-2"
  //       >
  //         <FiArrowLeft />
  //         Start Shopping
  //       </NavLink>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-5 mb-10 w-10/12 mt-4 mx-auto min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-[20px] text-gray-800">
          My Wishlist{" "}
          <span className="text-sm text-gray-700 font-sans">
            {/* ({`${totalWishList} item${totalWishList > 1 ? "'s" : ""}`}) */}
          </span>
        </h1>
        <div className="flex gap-10">
          <NavLink to="/product">
            <span
              className="flex items-center gap-1 text-blue-500 font-sans cursor-pointer
                    hover:text-blue-600 transition-all duration-300"
            >
              <FiArrowLeft />
              <span>Continue Shopping</span>
            </span>
          </NavLink>
          <button
            className="border border-red-500 px-3 py-1 rounded text-red-500 text-sm
                    cursor-pointer hover:bg-red-50 transition-colors duration-300"
            // onClick={() => clearWishList()}
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <ProductCard item={item} />
      </div>
    </div>
  );
};

export default Wishlist;
