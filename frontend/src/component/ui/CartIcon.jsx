import { PiShoppingCart } from "react-icons/pi";
import { useGetTotalCartItemQuery } from "../../redux/features/product/cartApi";

const CartIcon = () => {
  const { data, isLoading } = useGetTotalCartItemQuery();

  return (
    <div className="sm:relative fixed -bottom-135 sm:bottom-0 left-10 sm:left-0">
      <PiShoppingCart size={23} className="text-gray-700 cursor-pointer" />
      <span className="absolute -top-2 -right-2 bg-orange-600 text-[10px] outline outline-gray-50 text-white font-sans font-thin rounded-full w-4 h-4 flex items-center justify-center">
        {data?.totalItem || 0}
      </span>
    </div>
  );
};

export default CartIcon;
