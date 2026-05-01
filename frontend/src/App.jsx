import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PageLayout from "./component/common/PageLayout";
import AddProduct from "./component/pages/AddProduct";
import ResetPassword from "./component/pages/ResetPassword";
import Login from "./component/pages/Login";
import Home from "./component/pages/Home";
import EsewaPayment from "./component/pages/EsewaPayment";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "add-product",
          element: <AddProduct />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "esewa-payment",
          element: <EsewaPayment />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
