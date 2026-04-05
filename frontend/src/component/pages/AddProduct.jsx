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
    <div>
      <h1>Add product</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Brand"
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          onChange={(e) => setForm({ ...form, stock: +e.target.value })}
        />
        <textarea
          type="text"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category ID"
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <button type="submit">Add product</button>
      </form>
    </div>
  );
};

export default AddProduct;
