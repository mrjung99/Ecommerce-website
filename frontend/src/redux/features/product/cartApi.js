import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",

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

  tagTypes: ["Cart"],

  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    getTotalCartItem: builder.query({
      query: () => "/cart/total",
      providesTags: ["Cart"],
    }),

    getUserCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),

      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetTotalCartItemQuery,
  useGetUserCartQuery,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;
