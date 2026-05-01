import React, { useRef } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import ProductCard from "../ui/ProductCard";

const Home = () => {
  const boxRef = useRef(null);
  const handlePrev = () => {
    if (boxRef.current) {
      boxRef.current.scrollLeft -= boxRef.current.clientWidth;
    }
  };

  const handleNext = () => {
    if (boxRef.current) {
      boxRef.current.scrollLeft += boxRef.current.clientWidth;
    }
  };

  return (
    <section className="relative max-w-11/12 mx-auto">
      <div className="flex flex-col lg:flex-row justify-around bg-gray-100 px-8 h-lvh lg:h-[65vh] lg:mt-10 lg:px-20 lg:items-center lg:gap-15 lg:p-10 lg:justify-between lg:rounded-xl">
        <div className=" font-sans">
          <h1 className="text-2xl text-center lg:text-left font-light m-0 lg:text-gray-800">
            Welcome to
          </h1>
          <h1 className="text-4xl lg:text-5xl text-center font-sans font-bold lg:text-left text-gray-700 m-0 ">
            <span className="">KINMEL</span>
            <span className="">BAZAR</span>
          </h1>
          <p className="text-xl lg:text-lg text-center lg:text-left font-light leading-normal lg:text-gray-800">
            Quality products for every corner of your life, with prices that
            make sense.
          </p>
        </div>
        <div className=" relative flex">
          <img
            className="relative z-3 w-[95%]"
            src="https://plus.unsplash.com/premium_photo-1661479824677-19535ce314fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwc2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
            alt=""
          />
          <div className="absolute -top-5 left-5 h-full lg:h-full w-[95%]  bg-blue-200 z-1"></div>
        </div>
        <button className="relative -top-20 z-40 lg:absolute lg:left-20 lg:top-75 flex items-center gap-3 bg-orange-600 text-lg text-gray-200 px-3 py-1 rounded-md hover:translate-x-1 w-fit hover:bg-orange-500 cursor-pointer transition-all duration-100">
          <FaBagShopping />
          <span>Shop Now</span>
        </button>
      </div>
      <div className="my-20">
        <h2 className="text-xl my-1 font-sans text-gray-800 mb-2 ">
          Popular product
        </h2>
        <div className=" shadow-[0_0_2px_rgba(0,0,0,0.3)] rounded relative">
          <button
            className=" absolute z-30 top-1/2 -translate-y-1/2 left-0  flex justify-center 
            items-center bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] p-1 rounded-full
          text-white h-10.5 w-10.5 cursor-pointer"
            onClick={handlePrev}
          >
            <GrPrevious size={23} />
          </button>
          <button
            className=" absolute z-60 top-1/2 -translate-y-1/2 right-0 flex justify-center 
            items-center bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] p-1 rounded-full
          text-white h-10.5 w-10.5 cursor-pointer"
            onClick={handleNext}
          >
            <GrNext size={23} />
          </button>

          <div
            ref={boxRef}
            className="flex gap-6 overflow-x-hidden p-3 scroll-smooth bg-white"
          >
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
