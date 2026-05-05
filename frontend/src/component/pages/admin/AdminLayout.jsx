import React, { useState } from "react";
import AdminSidebar from "./pages/AdminSidebar";
import AdminTopBar from "./pages/AdminTopBar";
import { Outlet } from "react-router-dom";
import AdminProfileOptions from "./ui/AdminProfileOptions";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex  bg-gray-100 dark:bg-linear-to-r dark:from-gray-900 dark:to-gray-800 ">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed top-16 inset-0 bg-black bg-opacity-40 z-30 md:hidden transition ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 top-16 left-0 z-40 bg-gray-800 text-white transform transition-all duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 
        ${collapsed ? "w-20" : "w-55"}`}
      >
        <AdminSidebar collapsed={collapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 
        ${collapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        {/* Topbar */}
        <div
          className="fixed top-0 left-0 right-0 z-20 h-16 w-full bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4
        md:left-auto"
        >
          <AdminTopBar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            toggleCollapse={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* Content */}
        <main className="mt-16 p-4 overflow-y-auto text-gray-900 dark:text-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
