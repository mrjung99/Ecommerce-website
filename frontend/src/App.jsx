import React from "react";
import AddProduct from "./component/pages/AddProduct";

const App = () => {
  console.log(import.meta.env.VITE_ACCESS_TOKEN);
  const timestamp = Math.round(new Date().getTime() / 1000);
  console.log(timestamp);

  return (
    <div>
      <h1 className="text-4xl text-gray-800 text-center font-medium">
        Sajha store
      </h1>
      <AddProduct />
    </div>
  );
};

export default App;
