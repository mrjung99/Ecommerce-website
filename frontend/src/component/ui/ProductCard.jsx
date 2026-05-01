import React from "react";
import productImage from "../../assets/download.jpg";
import AddToCardButton from "./AddtoCardButton";

const ProductCard = () => {
  return (
    <div
      className=" min-w-50 bg-white hover:outline-gray-400 
        hover:bg-gray-100 hover:scale-102 shadow-[0_0_1px_rgba(0,0,0,0.5)] 
        hover:shadow-[0_0_5px_rgba(0,0,0,0.3)] p-2 rounded transition-all duration-300 
        ease"
    >
      <img src={productImage} alt="" />
      <h1 className="mt-3 text-blue-500 cursor-pointer hover:text-blue-400 font-sans">
        Iphone 14 pro max
      </h1>
      <div className="flex justify-between mt-2">
        <h3 className="text-orange-600 text-lg">
          <span>Rs.</span>
          <span>100</span>
        </h3>
        <p className="font-light text-sm">
          Brand: <span>Apple</span>
        </p>
      </div>
      <div className="mt-2">
        <AddToCardButton />
      </div>
    </div>
  );
};

export default ProductCard;
