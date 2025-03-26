import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-categorys",{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
export const get_products = createAsyncThunk(
  "product/get_products",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-products",{
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/price-range-latest-product",{
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone);
    }
  }
);
export const query_products = createAsyncThunk(
  "product/query_products",
  async (
    { sortPrice, category, low, high, rating, pageNumber, searchValue },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      // สร้าง query string โดยเช็คว่ามีการกำหนดค่าก่อนเพิ่มลงใน URL
      let query = `/query-products?`;
      if (category) query += `category=${encodeURIComponent(category)}&`;
      if (sortPrice) query += `sortPrice=${encodeURIComponent(sortPrice)}&`;
      if (low !== undefined) query += `lowPrice=${encodeURIComponent(low)}&`;
      if (high !== undefined) query += `highPrice=${encodeURIComponent(high)}&`;
      if (rating) query += `rating=${encodeURIComponent(rating)}&`;
      if (pageNumber) query += `pageNumber=${encodeURIComponent(pageNumber)}&`;
      if (searchValue)
        query += `searchValue=${encodeURIComponent(
          searchValue ? searchValue : ""
        )} `;

      // ตัดเครื่องหมาย & ท้ายสุดในกรณีที่ไม่มีการใช้งานตัวสุดท้าย
      query = query.endsWith("&") ? query.slice(0, -1) : query;

      const { data } = await api.get(query ,{
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.error("Error:", error.response);
      return rejectWithValue(error.response.data); // ส่งคืนข้อมูลของ error
    }
  }
);
export const product_details = createAsyncThunk(
  "product/product_details",
  async (slug, { fulfillWithValue, rejectWithValue }) => {
    try {
      console.log(slug);
      const { data } = await api.get(`/product-details/${slug}`,{
        withCredentials: true,
      });
      //  console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const add_reviews = createAsyncThunk(
  "product/add_reviews",
  async (
    { productId, rating, review, name },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(`/add-reviews/${productId}`, {
        rating,
        review,
        name,
      },{
        withCredentials: true,
      });
      //  console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_reviews = createAsyncThunk(
  "product/get_reviews",
  async ({ productId }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/get-reviews/${productId}`,{
        withCredentials: true,
      });
      //  console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
///profile_seller
export const get_profile_seller= createAsyncThunk(
  "product/get_profile_seller",
  async ({ sellerId }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/get_profile_seller/${sellerId}`,{
        withCredentials: true,
      });
      //  console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const homeReducer = createSlice({
  name: "home",
  initialState: {
    categorys: [],
    products: [],
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    parPage: 3,
    totalProducts: 0,
    priceRange: {
      low: 0,
      high: 100,
    },
    /// Product Details
    product: {},
    relatedProducts: [],
    moreProducts: [],
    reviews: [],
    reviews_count: 0,
    ////products_seller
    products_seller:[],
    reviwes_seller1:[],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.categorys = payload.categorys;
      })
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.latest_product = payload.latest_product;
        state.topRated_product = payload.topRated_product;
        state.discount_product = payload.discount_product;
      })
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latest_product;
        state.priceRange = payload.priceRange;
      })
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        state.totalProducts = payload.totalProducts;
        state.parPage = payload.parPage;
      })
      .addCase(product_details.fulfilled, (state, { payload }) => {
        state.product = payload.product;
        state.relatedProducts = payload.relatedProducts;
        state.moreProducts = payload.moreProducts;
      })
      .addCase(add_reviews.fulfilled, (state, { payload }) => {
        state.successMessage = payload.successMessage;
      })
      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        state.reviews = payload.reviews;
        state.reviews_count = payload.reviews_count;
      })
      .addCase(get_profile_seller.fulfilled, (state, { payload }) => {
        state.products_seller = payload.products_seller;
        state.reviwes_seller1 = payload.reviews;
      });
  },
});

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
