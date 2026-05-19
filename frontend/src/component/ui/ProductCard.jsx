import { MdAddShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../redux/features/product/cartApi";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const goToDetails = () => {
    navigate(`/productDetails/${product.id}`);
  };

  const [addToCart] = useAddToCartMutation();

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      console.log("Add to cart called: ", productId, quantity);

      await addToCart({ productId, quantity }).unwrap();

      toast.success("Product added to the cart.");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div
      className=" min-w-50 bg-white hover:outline-gray-400 
        hover:bg-gray-100 hover:scale-102 shadow-[0_0_1px_rgba(0,0,0,0.5)] 
        hover:shadow-[0_0_5px_rgba(0,0,0,0.3)] p-2 rounded transition-all duration-300 
        ease"
    >
      <img
        src={product.images[0].thumbnail}
        alt=""
        onClick={goToDetails}
        className="cursor-pointer"
      />
      <h1
        className="mt-3 text-blue-500 cursor-pointer hover:text-blue-400 font-sans"
        onClick={goToDetails}
      >
        {product.name}
      </h1>

      <div className="flex justify-between mt-2">
        <h3 className="text-orange-600 text-lg">
          <span>Rs.</span>
          <span>{product.price}</span>
        </h3>
        <p className="font-light text-sm">
          Brand: <span>{product.brand}</span>
        </p>
      </div>
      <div className="mt-2">
        <button
          className="flex bg-emerald-600 hover:bg-emerald-700 text-gray-100 items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer"
          onClick={() => handleAddToCart(product.id)}
        >
          <MdAddShoppingCart />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
