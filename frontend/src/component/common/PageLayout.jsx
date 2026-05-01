import React from "react";
import NabBar from "./NabBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import TopBar from "./TopBar";

const PageLayout = () => {
  return (
    <div>
      <TopBar />
      <NabBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PageLayout;
