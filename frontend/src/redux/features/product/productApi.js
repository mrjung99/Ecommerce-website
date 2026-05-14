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

    getCategories: builder.query({
      query: () => "/categories",
    }),

    getCloudinarySignature: builder.query({
      query: (folder) => `/cloudinary/signature?folder=${folder}`,
    }),

    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: "/cloudinary/deleteImage",
        method: "Delete",
        body: { publicId },
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetCategoriesQuery,
  useDeleteImageMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useLazyGetCloudinarySignatureQuery,
} = productApi;
