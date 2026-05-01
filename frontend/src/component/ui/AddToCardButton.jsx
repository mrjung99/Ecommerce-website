import React from "react";
import { MdAddShoppingCart } from "react-icons/md";
const AddToCardButton = () => {
  return (
    <button className="flex flex-row items-center gap-2 bg-green-600 px-2 py-1 rounded text-sm text-white cursor-pointer hover:bg-green-700">
      <MdAddShoppingCart />
      <span>Add to cart</span>
    </button>
  );
};

export default AddToCardButton;
