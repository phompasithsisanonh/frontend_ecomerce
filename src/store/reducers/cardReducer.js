import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_to_card = createAsyncThunk(
  "card/add_to_card",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/add-to-card", info,{
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const get_card_products = createAsyncThunk(
  "card/get_card",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_card/${userId}`,{
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method
export const quanlity_plus = createAsyncThunk(
  "card/quanlity_plus",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/query-product-plus/${card_id}`,{
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method
export const quanlity_mius = createAsyncThunk(
  "card/quanlity_mius",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/query-product-minus/${card_id}`,{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteCard = createAsyncThunk(
  "card/delete-card",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/delete-card/${card_id}`,{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const wishlist = createAsyncThunk(
  "card/wishlist",
  async ({ id, productId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/wishlist/${id}`, { productId },{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_wishlist = createAsyncThunk(
  "card/get_wishlist",
  async ({ id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_wishlish/${id}`,{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method
export const cardReducer = createSlice({
  name: "card",
  initialState: {
    card_products: [],
    card_product_count: 0,
    price: 0,
    errorMessage: "",
    successMessage: "",
    shipping_fee: 0,
    outofstock_products: [],
    buy_product_item: 0,
    wishlists: [],
    wishlist_count: 0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    reset_count: (state, _) => {
      state.card_product_count = 0;
      state.wishlist_count = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(add_to_card.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(add_to_card.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.card_product_count = state.card_product_count + 1;
      })

      .addCase(get_card_products.fulfilled, (state, { payload }) => {
        state.card_products = payload.card_products;
        state.price = payload.price;
        state.card_product_count = payload.card_product_count;
        state.shipping_fee = payload.shipping_fee;
        state.outofstock_products = payload.outOfStockProduct;
        state.buy_product_item = payload.buy_product_item;
      })
      .addCase(quanlity_plus.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(quanlity_mius.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(deleteCard.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(wishlist.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(get_wishlist.fulfilled, (state, { payload }) => {
        state.wishlists = payload.dataWish;
        state.wishlist_count = payload.wishlistCount;
      });
  },
});
export const { messageClear, reset_count } = cardReducer.actions;
export default cardReducer.reducer;
