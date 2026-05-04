import React from "react";
import { NavLink } from "react-router-dom";
import { RiHome4Fill } from "react-icons/ri";
import { GrDocumentStore } from "react-icons/gr";
import { FaUserCog } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";

const AdminSidebar = ({ collapsed }) => {
  const linkClass =
    "flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition";

  const activeClass = "bg-gray-700";

  return (
    <div className="h-full p-3 text-gray-300">
      {/* <h2 className={`text-xl font-bold mb-6 ${collapsed && "hidden"}`}>
        Admin
      </h2> */}

      <nav className="space-y-1.5">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <RxDashboard size={22} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaUsers size={22} />
          {!collapsed && <span>Users</span>}
        </NavLink>

        <NavLink
          to="products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <GrDocumentStore size={20} />
          {!collapsed && <span>Products</span>}
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaTasks size={21} />
          {!collapsed && <span>Orders</span>}
        </NavLink>

        <NavLink
          to="payment"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaFileInvoiceDollar size={20} />
          {!collapsed && <span>Payment</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
