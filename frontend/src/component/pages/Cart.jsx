// components/pages/CartPage.jsx
import { NavLink } from "react-router-dom";
import { FiPlus, FiMinus, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  useClearCartMutation,
  useDeleteCartItemMutation,
  useGetUserCartQuery,
  useUpdateCartItemMutation,
} from "../../redux/features/product/cartApi";
import { toast } from "react-toastify";
import { useCallback } from "react";
import Loader from "../ui/Loader";

const Cart = () => {
  const { data, isLoading, isFetching } = useGetUserCartQuery();
  const [deleteItem] = useDeleteCartItemMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const cartItems = data?.cart?.cart?.items || [];

  const cart = data?.cart || [];

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id).unwrap();
    } catch (error) {
      toast.error("Failed to delete item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
    } catch (error) {
      toast.error(error.data.message || "Failed to clear cart.");
    }
  };

  const handleIncrease = async (item) => {
    if (item.quantity >= item.product.stock) return;

    await updateCartItem({
      itemId: item.product.id,
      quantity: item.quantity + 1,
    }).unwrap();
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    await updateCartItem({
      itemId: item.product.id,
      quantity: item.quantity - 1,
    }).unwrap();
  };

  if (isLoading || isFetching) return <Loader />;

  if (!cartItems.length) {
    return (
      <div className="min-h-[81vh] flex flex-col items-center justify-center">
        <FiShoppingCart className="text-8xl text-gray-300 mb-6" />
        <h1 className="text-xl font-bold text-gray-700 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8 text-sm text-center max-w-md">
          Looks like you haven't added any products to your cart yet.
        </p>
        <NavLink
          to="/products"
          className="px-8 py-3 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <FiArrowLeft />
          Start Shopping
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-11/12 mx-auto">
      <div className="container max-w6xl mx-auto">
        <div className="mt-4">
          <h1 className="text-[20px] text-gray-800 ">Your Shopping Cart</h1>
          <p className="text-[15px] leading-7 font-sans font-light">
            You have{" "}
            <span className="text-orange-500 font-medium">
              {cartItems.length + " "}
            </span>
            Item{cartItems.length > 1 ? "'s" : ""} in your cart
          </p>
        </div>
        <div className="py-3 flex gap-8">
          <div className="lg:w-2/3 ">
            <div className="rounded-lg p-2 bg-white shadow-[0_0_1px_rgba(0,0,0,0.5)]">
              <div className="p-3 border-b border-gray-400 text-[15px]  text-gray-800">
                <div className="grid grid-cols-12 gap-4 font-sans">
                  <div className="col-span-5 ">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
              </div>

              <div className="divide-y divide-gray-300">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="grid grid-cols-12">
                    <div className="col-span-5 flex items-center gap-4 p-2">
                      <img
                        src={item.product.images[0].thumbnail}
                        alt={item.product.name}
                        className="shrink-0 w-10 h-10 rounded-lg object-cover"
                      />
                      <NavLink to={`/productDetails/${item.id}`}>
                        <p className="text-[15px] font-sans font-light cursor-hover:text-orange-600 transition-colors duration-300 ease-in-out">
                          {item.product.name.charAt(0).toUpperCase() +
                            item.product.name.slice(1)}
                        </p>
                      </NavLink>
                    </div>

                    <div className="col-span-2 flex items-center justify-center gap-3">
                      <button
                        className={`cursor-pointer ${item.quantity === 1 ? "bg-gray-100" : "bg-gray-200"}`}
                        onClick={() => handleDecrease(item)}
                        disabled={item.quantity === 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="text-[14px] font-sans font-light">
                        {item.quantity}
                      </span>
                      <button
                        className="cursor-pointer bg-gray-200"
                        onClick={() => handleIncrease(item)}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="col-span-2 flex items-center justify-center gap-3">
                      <p className="text-[14px] font-sans font-light">
                        Rs. {item.snapshotPrice}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center justify-center gap-3">
                      <p className="text-[14px] font-sans font-light">
                        Rs. {item.snapshotPrice * item.quantity}
                      </p>
                    </div>

                    <div className="col-span-1 flex items-center justify-center gap-3 text-red-500 ">
                      <MdDelete
                        size={20}
                        className="hover:text-red-600 cursor-pointer"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center p-4 mt-10">
                <NavLink to="/products">
                  <p
                    className="flex gap-1.5 items-center text-blue-500 
                                hover:text-blue-800 cursor-pointer transition-all duration-300 font-sans"
                  >
                    <FiArrowLeft /> Continue Shopping
                  </p>
                </NavLink>
                <button
                  className="border border-red-500 rounded text-red-500 text-sm hover:bg-red-50 cursor-pointer px-3 py-1 transition-all duration-300 font-sans"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 min-h-screen">
            <div className="bg-white shadow-[0_0_1px_rgba(0,0,0,0.5)] rounded-lg px-6 py-4 sticky top-22">
              <h2 className="text-[20px] mb-4 text-gray-800">Order Summary</h2>
              <div className="space-y-3 font-sans font-light">
                <div className="flex justify-between">
                  <span className="">Subtotal</span>
                  <span className="">Rs. {cart.subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Shipping</span>
                  <span className="text-blue-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="">Tax (13%)</span>
                  <span className="">Rs. {cart.vat}</span>
                </div>
              </div>
              <div className="border-t border-gray-500 font-sans font-light my-3">
                <div className="flex justify-between mt-1">
                  <span className="text-lg">Grand Total</span>
                  <span className="">
                    <span className="text-orange-600 font-medium">
                      Rs.{cart.totalAmount}
                    </span>
                  </span>
                </div>
              </div>
              <NavLink to="/checkout">
                <button
                  className="bg-orange-600 hover:bg-orange-500 text-white font-sans px-3 py-1 
                  cursor-pointer mt-3 transition-colors duration-300 rounded"
                >
                  Proceed to Checkout
                </button>
              </NavLink>
              <div className="mt-5">
                <p className="text-sm text-gray-600">We accept:</p>
                <div className="flex gap-2 mt-1">
                  <div className="p-2 border rounded">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
                      alt="Visa"
                      className="h-6"
                    />
                  </div>
                  <div className="p-2 border rounded">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/196/196561.png"
                      alt="Mastercard"
                      className="h-6"
                    />
                  </div>
                  <div className="p-2 border rounded">
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/196/196565.png"
                      alt="PayPal"
                      className="h-6"
                    />
                  </div>
                  <div className="p-2 border rounded">
                    <img
                      src="data:image/png;base64,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"
                      alt="PayPal"
                      className="h-6"
                    />
                  </div>
                  <div className="p-2 border rounded">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKOfwmcx10XZsVfYJ_by52ETThjY4wVvoieQ&s"
                      alt="PayPal"
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
