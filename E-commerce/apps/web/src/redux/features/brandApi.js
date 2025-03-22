import { apiSlice } from "../api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    getActiveBrands: builder.query({
      query: () => `https://ecom-backend.vercel.app/api/brand/active`
    }),
  }),
});

export const {
 useGetActiveBrandsQuery
} = brandApi;
