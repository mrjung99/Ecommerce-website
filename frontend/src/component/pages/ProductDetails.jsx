import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { RiSubtractLine } from "react-icons/ri";
import { FiArrowLeft, FiHeart } from "react-icons/fi";
import { useGetProductQuery } from "../../redux/features/product/productApi";
import Loader from "../ui/Loader";
import { useAddToCartMutation } from "../../redux/features/product/cartApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectCurrentUser,
} from "../../redux/features/auth/authSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const inWishList = true;
  const [addToCart] = useAddToCartMutation();
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductQuery(id);
  if (isLoading) return <Loader />;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, data?.data?.stock || 1)));
  };

  const handleAddToCart = async () => {
    if (!user || !accessToken) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({
        productId: data?.data?.id,
        quantity,
      }).unwrap();
      toast.success("Product added to cart.");
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <section className="w-10/12 mx-auto my-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <img
            src={data?.data?.images?.[0]?.originalUrl}
            alt=""
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex-col gap-2">
          <div>
            <p className="text-2xl text-gray-800">
              {data?.data?.name?.charAt(0).toUpperCase() +
                data?.data?.name?.slice(1)}
            </p>
            <p className="text-blue-500 text-[14px]">Rating ⭐⭐</p>
          </div>

          <div className="my-3">
            <p className="text-lg text-gray-800 text-[15px] font-sans">
              Description:{" "}
            </p>
            <p className="text-[15px] font-sans font-thin">
              {data?.data?.description}
            </p>
          </div>

          <p className="text-gray-600 text-[14px] font-sans">
            Brand:{" "}
            <span className="text-blue-600">
              {data?.data?.brand?.charAt(0).toUpperCase() +
                data?.data?.brand?.slice(1)}
            </span>
          </p>
          <p className="text-orange-600 text-2xl font-sans mt-3">
            Rs.{Number(data?.data?.price)}
          </p>
          <p className="text-orange-600 text-2xl font-sans mt-3">
            <span>Stock: </span>
            <span>{data?.data?.stock}</span>
          </p>

          <div className="flex gap-5 items-center justify-center mt-7 text-[12px]">
            <p>Quantity: </p>
            <div className="flex-1 flex gap-3">
              <button
                className={`flex items-center justify-center cursor-pointer 
                           //  px-1 ${quantity <= 1 ? "bg-gray-100" : "bg-gray-300"}`}
                disabled={quantity <= 1}
                onClick={() => setQuantity((prev) => prev - 1)}
              >
                <RiSubtractLine size={20} />
              </button>

              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-gray-100  text-center w-10 outline-0 px-1"
              />

              <button
                className="flex items-center justify-center cursor-pointer
                                bg-gray-300 px-1"
                disabled={quantity >= data?.data?.stock}
                onClick={() =>
                  setQuantity((prev) => Math.min(prev + 1, data?.data?.stock))
                }
              >
                <IoIosAdd size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[14px] mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer 
                            transition-colors text-white px-3 py-1 rounded"
            >
              Buy Now
            </button>
            <button
              className="bg-orange-600 hover:bg-orange-700 cursor-pointer 
                            transition-colors text-white px-3 py-1 rounded"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <FiHeart
              size={28}
              className={`${inWishList ? "text-red-500 hover:text-gray-500" : "text-gray-500 hover:text-red-500"} fill-current cursor-pointer`}
              //   onClick={() => toggleWishList(productDetails)}
            />
          </div>
          <NavLink to="/products">
            <p
              className="flex gap-2 items-center mt-3 text-blue-500 hover:text-blue-800 
                    cursor-pointer transition-colors duration-300"
            >
              <FiArrowLeft />
              Continue Shopping
            </p>
          </NavLink>
        </div>
      </div>

      <div className="bg-gray-100 p-3 mt-8">
        <p className="text-2xl text-gray-800">
          Product Detail of{" "}
          <span className="text-blue-500">
            {data?.data?.name?.charAt(0).toUpperCase() +
              data?.data?.name?.slice(1)}
          </span>
        </p>
        <p className="border border-gray-300 text-[15px] p-2 font-sans font-thin mt-2">
          {data?.data?.description}
        </p>
      </div>
    </section>
  );
};

export default ProductDetails;
