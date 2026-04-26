import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AddProduct from "./component/pages/AddProduct";
import ResetPassword from "./component/pages/ResetPassword";
import Login from "./component/pages/Login";

/* Home Page */
const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-800">Kinmel</h1>
      <p className="mt-3 text-gray-500">Welcome to Kinmel</p>
    </div>
  );
};

/* Router Config */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/add-product",
    element: <AddProduct />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
