import { useState } from "react";
import { uploadImageToCloudinary } from "../../../../utils/upload-image";
import { FaPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";

import {
  useAddProductMutation,
  useDeleteImageMutation,
  useGetChildCategoryQuery,
  useLazyGetCloudinarySignatureQuery,
} from "../../../../redux/features/product/productApi";
import { toast } from "react-toastify";

const AdminProduct = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    stock: "",
    price: "",
    categoryId: "",
  });

  const { data } = useGetChildCategoryQuery();
  const categories = data?.childCategory;

  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
  }));

  const [createProduct, { isLoading }] = useAddProductMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [getSignature] = useLazyGetCloudinarySignatureQuery();

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setUploadingImages(true);

      const sig = await getSignature("products").unwrap();

      const uploaded = await Promise.all(
        files.map((file) => uploadImageToCloudinary(file, sig)),
      );

      setUploadedImages((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed!");
    } finally {
      setUploadingImages(false);
    }
  };

  // ---------------- REMOVE IMAGE ----------------
  const removeImage = async (index, img) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    await deleteImage(img.publicId);
    toast.success("Image deleted.");
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        stock: Number(formData.stock),
        price: Number(formData.price),
        categoryId: formData.categoryId,

        images: uploadedImages,
      };

      await createProduct(payload).unwrap();

      toast.success("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        brand: "",
        stock: "",
        price: "",
        categoryId: "",
      });

      setUploadedImages([]);
    } catch (error) {
      console.error(error);
      toast.error(error.data.message || "Failed to add product.");
    }
  };

  return (
    <div className="">
      <div className="w-full md:px-2 overflow-hidden">
        {/* Header */}
        <div className="px-4">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-300">
            Add New Product
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 p-4 md:py-5 space-y-4">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
            {/* Name */}
            <div>
              <label className="block mb-1 text-sm font-thin text-gray-300">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Macbook pro"
                className="w-full border border-gray-500 outline-0 rounded-lg px-3 py-2 text-sm text-gray-300 font-light focus:outline-none focus:ring focus:ring-orange-200"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-1 text-sm font-thin text-gray-300">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="Apple"
                className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-300 font-light focus:outline-none focus:ring-1 focus:ring-orange-200"
              />
            </div>

            {/* Price */}
            <div className="md:col-span-2 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-7">
              <div>
                <label className="block mb-1 text-sm font-thin text-gray-300">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="1200"
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-300 font-lighter focus:outline-none focus:ring-1 focus:ring-orange-200"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block mb-1 text-sm font-thin text-gray-300">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="20"
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-300 font-lighter focus:outline-none focus:ring-1 focus:ring-orange-200"
                />
              </div>

              {/* Category */}
              <div className="">
                <label className="block mb-1 text-sm font-thin text-gray-300">
                  Category
                </label>

                <Select
                  options={categoryOptions}
                  value={categoryOptions?.find(
                    (option) => option.value === formData.categoryId,
                  )}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      categoryId: selectedOption.value,
                    })
                  }
                  placeholder="Select Category"
                  className="text-sm cursor-pointer"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#1f2937",
                      color: "white",
                      borderColor: state.isFocused ? "#fdba74" : "#6b7280",

                      // REMOVE BLUE OUTLINE
                      boxShadow: "none",
                      outline: "none",

                      cursor: "pointer",

                      "&:hover": {
                        borderColor: state.isFocused ? "#fdba74" : "#6b7280",
                      },
                    }),

                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#1f2937",
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                      color: "#fff",
                      cursor: "pointer",
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: "#fff",
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-thin text-gray-300">
              Description
            </label>

            <textarea
              rows="6"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Write product description..."
              className="w-full border border-gray-500 text-sm text-gray-300 font-light rounded-xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-orange-200"
            />
          </div>

          {/* Upload Section */}
          <div className="p-1">
            <label className="block mb-2 font-thin text-sm text-gray-300">
              Product Images
            </label>

            <label className="flex flex-col items-center justify-center border border-dashed border-orange-300 rounded-xl p-5 cursor-pointer bg-gray-50/5 hover:bg-orange-50/10 transition">
              <div className="text-center">
                <div className="w-15 h-15 bg-orange-50/20 rounded-full flex items-center shadow-2xl justify-center mx-auto mb-4">
                  <span className="text-orange-600">
                    <FaPlus size={21} />
                  </span>
                </div>

                <p className="text-sm  text-gray-500">Upload Product Images</p>

                <p className="text-sm text-gray-400">PNG, JPG, WEBP</p>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Uploading */}
            {uploadingImages && (
              <div className="mt-4 text-orange-600 font-medium">
                Uploading images...
              </div>
            )}

            {/* Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
              {uploadedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl overflow-hidden shadow-md"
                >
                  <img
                    src={img.thumbnail}
                    alt=""
                    className="w-full h-40 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index, img)}
                    className="absolute flex items-center justify-center top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <RxCross1 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || uploadingImages}
            className="w-full bg-line bg-linear-to-r from-orange-700/70 to-orange-600/60 hover:bg-orange-700/70 transition text-white py-3 rounded-lg shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProduct;
