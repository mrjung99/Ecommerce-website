import React, { useState } from "react";
import Select from "react-select";
import {
  useCreateCategoryMutation,
  useGetChildCategoryQuery,
  useGetParentCategoryQuery,
} from "../../../../redux/features/product/productApi";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [addCategory, { isLoading: adding }] = useCreateCategoryMutation();

  const [createCategory, setCreateCategory] = useState({
    parentId: "",
    name: "",
    slug: "",
  });

  const [createParent, setCreateParent] = useState({
    name: "",
    slug: "",
  });

  const { data: parent, isLoading } = useGetParentCategoryQuery();
  const parentCategories = parent?.parentCategory ?? [];
  const parentCategoryOptions = parentCategories?.map((category) => ({
    value: category.id,
    label: category.name.charAt(0).toUpperCase() + category.name.slice(1),
  }));

  const handleCreateParent = async (e) => {
    try {
      await addCategory(createParent).unwrap();

      toast.success("Parent category added successfully.");
      setCreateParent({
        name: "",
        slug: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.data.message || "Failed to add parent category!");
    }
  };

  const handleCreateChildren = async (e) => {
    try {
      await addCategory(createCategory).unwrap();
      toast.success("Children category added successfully.");

      setCreateCategory({
        parentId: "",
        name: "",
        slug: "",
      });
    } catch (error) {
      toast.error(error.data.message || "Failed to create children category.");
      console.error(error);
    }
  };

  return (
    <div className="w-full h-lvh grid grid-cols-1 md:grid-cols-2 gap-10 p-5">
      <div className="w-full col-span-1 max-h-65 border border-gray-600 bg-gray-700/10 p-8 rounded-2xl">
        <p className="mb-3 text-gray-300">Add Parent category</p>
        <div className="w-full">
          <label htmlFor="" className="text-sm text-gray-300 font-thin">
            Name :
          </label>
          <input
            type="text"
            value={createParent.name}
            placeholder="Electronics"
            className="w-full border mt-1 font-thin text-gray-300 border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-200"
            onChange={(e) =>
              setCreateParent({
                name:
                  e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1),
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
          />
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            className="mt-6 bg-emerald-700 px-5 py-1 rounded-md text-gray-300 hover:bg-emerald-600 cursor-pointer transition-all duration-100 ease-in"
            onClick={handleCreateParent}
          >
            Add
          </button>
        </div>
      </div>

      <div className="md:w-11/12 max-h-65 col-span-1 border border-gray-600 rounded-2xl bg-gray-700/10 p-7 space-y-2">
        <p className="text-gray-300">Add Children category</p>
        <div className="flex flex-col gap-7 mt-4">
          <Select
            options={parentCategoryOptions}
            value={
              parentCategoryOptions.find(
                (option) => option.value === createCategory.parentId,
              ) || null
            }
            onChange={(selectedOption) => {
              if (!selectedOption) return;
              setCreateCategory({
                parentId: selectedOption.value,
              });
            }}
            placeholder="Select main category"
            className="text-sm cursor-pointer w-full"
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
                left: "50%",
                transform: "translateX(-50%)",
                width: "max-content",
                minWidth: "100%",
              }),

              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                color: "#fff",
                cursor: "pointer",
              }),

              singleValue: (base) => ({
                ...base,
                color: "#d1d5db",
              }),
            }}
          />

          <div className="w-full">
            <input
              type="text"
              value={createCategory.name}
              placeholder="Enter child category"
              className="py-2 px-4 border border-gray-400 w-full rounded-md text-gray-300 font-thin focus:outline-none focus:ring-1 focus:ring-orange-200"
              onChange={(e) =>
                setCreateCategory((prev) => ({
                  ...prev,
                  name:
                    e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1),
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                }))
              }
            />
          </div>

          <div className="w-full flex items-center justify-center">
            <button
              className=" bg-emerald-700 px-5 py-1 rounded-md text-gray-300 hover:bg-emerald-600 cursor-pointer transition-all duration-100 ease-in"
              onClick={handleCreateChildren}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
