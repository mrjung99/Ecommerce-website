import React, { useState } from "react";
import { getSignature } from "../../utils/generate-signature";
import { uploadImageToCloudinary } from "../../utils/upload-image";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    stock: 0,
    price: 0,
    categoryId: "",
  });

  const [files, setFiles] = useState([]);

  const submit = async (e) => {
    e.preventDefault();

    const uploadedImages = await Promise.all(
      [...files].map(async (file) => {
        const sig = await getSignature();
        return uploadImageToCloudinary(file, sig);
      }),
    );

    const payload = {
      ...form,
      images: uploadedImages,
    };

    const res = await axios.post(
      "http://localhost:3000/api/v1/products",
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.data.success) {
      alert("Product added successfully");
    } else {
      alert(res.data.message);
    }
  };
  return (
    <div className="flex flex-col items-center space-y-5 mt-4 bg-gray-100 shadow-2xl md:max-w-4/12 sm:max-w-9/12 md:mx-auto">
      <h1 className="text-4xl">Add product</h1>
      <form onSubmit={submit} className="space-y-3 my-4 px-3 w-full">
        <div className="flex flex-col">
          <label htmlFor="">Product name:</label>
          <input
            className="border border-gray-400 p-1 rounded text-sm outline-none"
            type="text"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Brand: </label>
          <input
            className="border border-gray-400 p-1 rounded text-sm outline-none"
            type="text"
            placeholder="Brand"
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Price: </label>
          <input
            className="border border-gray-400 p-1 rounded text-sm outline-none"
            type="number"
            placeholder="Price"
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Stock: </label>
          <input
            className="border border-gray-400 p-1 rounded text-sm outline-none"
            type="number"
            placeholder="Stock"
            onChange={(e) => setForm({ ...form, stock: +e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Description: </label>
          <textarea
            className="border border-gray-400 rounded text-sm outline-none"
            type="text"
            placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Category: </label>
          <input
            className="border border-gray-400 p-1 rounded text-sm outline-none"
            type="text"
            placeholder="Category ID"
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="">Images: </label>
          <input
            className="border border-gray-400 rounded text-sm cursor-pointer"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <button
          type="submit"
          className="bg-orange-400 px-5 py-1 text-white rounded-md cursor-pointer mt-3 "
        >
          Add product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
