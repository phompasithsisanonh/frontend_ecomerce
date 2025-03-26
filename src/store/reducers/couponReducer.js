import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async ({ couponCode, idproducts },{ fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(`/apply-coupon`, {
        code: couponCode,
        idproducts,
      },{
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const couponReducer = createSlice({
  name: "coupon",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
    appliedCoupon: null,
    discountAmount: 0,
    data:[],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    resetCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(applyCoupon.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(applyCoupon.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.data = payload.data;
      });
  },
});

export const { messageClear, resetCoupon } = couponReducer.actions;
export default couponReducer.reducer;
