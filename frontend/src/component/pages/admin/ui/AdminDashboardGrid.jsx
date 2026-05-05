import React from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { LuListTodo } from "react-icons/lu";

const AdminDashboardGrid = () => {
  return (
    <div className="grid grid-rows-2 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between bg-linear-to-r from-emerald-600/60 to-emerald-400/70 rounded-md h-40 p-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-200 text-sm ">Total Products</p>
                <span className="text-gray-200 text-4xl font-bold">100</span>
              </div>
              <MdOutlineInventory2 size={30} className="text-gray-300" />
            </div>
            <div className="flex gap-2 text-sm text-gray-100 font-thin items-center">
              <p className="bg-gray-700/20 rounded-sm py-1 px-2 flex items-center justify-center">
                +30
              </p>
              <span>This month</span>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-linear-to-r from-orange-600/70 to-orange-400/60 rounded-md h-40 p-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-200 text-sm ">Total users</p>
                <span className="text-gray-200 text-4xl font-bold">100</span>
              </div>
              <FaUsers size={30} className="text-gray-300" />
            </div>
            <div className="flex gap-2 text-sm text-gray-100 font-thin items-center">
              <p className="bg-gray-700/20 rounded-sm py-1 px-2 flex items-center justify-center">
                +30
              </p>
              <span>This month</span>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-linear-to-r from-amber-600 to-amber-300/60 rounded-md h-40 p-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-200 text-sm ">Total Orders</p>
                <span className="text-gray-200 text-4xl font-bold">100</span>
              </div>
              <LuListTodo size={30} className="text-gray-300" />
            </div>
            <div className="flex gap-2 text-sm text-gray-100 font-thin items-center">
              <p className="bg-gray-700/20 rounded-sm py-1 px-2 flex items-center justify-center">
                +30
              </p>{" "}
              <span>This month</span>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-linear-to-r from-purple-600/50 to-purple-400/60 rounded-md h-40 p-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-gray-200 text-sm ">Total reviews</p>
                <span className="text-gray-200 text-4xl font-bold">100</span>
              </div>
              <MdReviews size={30} className="text-gray-300" />
            </div>
            <div className="flex gap-2 text-sm text-gray-100 font-thin items-center">
              <p className="bg-gray-700/20 rounded-sm py-1 px-2 flex items-center justify-center">
                +30
              </p>
              <span>This month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-linear-to-r from-blue-600 to-blue-400/70 rounded-md p-5 h-full flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-gray-200 text-lg ">Total Sales</p>
              <span className="text-gray-200 text-2xl font-bold">
                Rs. 8,98,92,75,729
              </span>
              <div className="mt-3">
                <p className="text-gray-100 font-thin text-sm">
                  Khalti : <span>Rs </span>
                  <span>100 k</span>
                </p>
                <p className="text-gray-100 font-light text-sm">
                  Esewa : <span>Rs </span>
                  <span>100 k</span>
                </p>
              </div>
            </div>
            <FcSalesPerformance size={30} />
          </div>
          <div className="flex gap-2 text-sm text-gray-100 font-thin items-center">
            <p className="bg-gray-700/20 rounded-sm py-1 px-2 flex items-center justify-center">
              +30K
            </p>
            <span>This month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardGrid;
