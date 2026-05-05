import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import TopBar from "./TopBar";
import NavBar from "./NavBar";

const PageLayout = () => {
  return (
    <div>
      <TopBar />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PageLayout;
