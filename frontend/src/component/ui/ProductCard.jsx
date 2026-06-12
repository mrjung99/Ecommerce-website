import { MdAddShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../redux/features/product/cartApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectCurrentUser,
} from "../../redux/features/auth/authSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);

  const [addToCart] = useAddToCartMutation();

  const goToDetails = () => {
    navigate(`/productDetails/${product.id}`);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!user || !accessToken) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId, quantity }).unwrap();
      // toast.success("Product added to cart");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div
      className="
        w-full
        bg-white
        rounded-lg
        p-3
        flex
        flex-col
        justify-between
        shadow-[0_0_2px_rgba(0,0,0,0.3)]
        hover:shadow-[0_0_10px_rgba(0,0,0,0.15)]
        hover:bg-gray-50
        transition-all
        duration-300
      "
    >
      {/* Product Image */}
      <div
        className="w-full h-52 overflow-hidden rounded-md"
        onClick={goToDetails}
      >
        <img
          src={product.images?.[0]?.thumbnail}
          alt={product.name}
          className="
            w-full
            h-full
            object-cover
            cursor-pointer
            hover:scale-105
            transition-transform
            duration-300
          "
        />
      </div>

      {/* Product Name */}
      <h1
        className="
          mt-3
          text-blue-500
          cursor-pointer
          hover:text-blue-400
          font-sans
          line-clamp-2
          min-h-8
        "
        onClick={goToDetails}
      >
        {product.name}
      </h1>

      {/* Price + Brand */}
      <div className="flex justify-between items-center mt-2 gap-2">
        <h3 className="text-orange-600 text-lg font-semibold">
          Rs. {product.price}
        </h3>

        <p className="font-light text-sm text-gray-600">
          Brand: <span>{product.brand}</span>
        </p>
      </div>

      {/* Add To Cart */}
      <div className="mt-4">
        <button
          className="
            w-fit
            flex
            items-center
            justify-center
            gap-2
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            py-2
            px-5
            rounded-md
            text-sm
            transition-colors
            duration-200
            cursor-pointer
          "
          onClick={() => handleAddToCart(product.id)}
        >
          <MdAddShoppingCart size={18} />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
