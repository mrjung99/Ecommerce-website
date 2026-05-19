import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products",
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Products"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        body: data,
      }),
    }),

    getParentCategory: builder.query({
      query: () => "/categories/parent",
    }),

    getChildCategory: builder.query({
      query: () => "/categories/children",
    }),

    getCloudinarySignature: builder.query({
      query: (folder) => `/cloudinary/signature?folder=${folder}`,
    }),

    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: "/cloudinary/deleteImage",
        method: "DELETE",
        body: { publicId },
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetParentCategoryQuery,
  useDeleteImageMutation,
  useCreateCategoryMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useGetChildCategoryQuery,
  useLazyGetCloudinarySignatureQuery,
} = productApi;
