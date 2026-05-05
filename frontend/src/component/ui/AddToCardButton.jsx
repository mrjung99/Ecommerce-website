import { MdAddShoppingCart } from "react-icons/md";
const AddToCardButton = () => {
  return (
    <button className="flex bg-green-600 items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer">
      <MdAddShoppingCart />
      <span>Add to cart</span>
    </button>
  );
};

export default AddToCardButton;
