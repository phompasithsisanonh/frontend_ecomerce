import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_payment = createAsyncThunk(
  "payment/wait_payment",
  async ({ userId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/wait_payment/${userId}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_payment_profile = createAsyncThunk(
  "payment/pay_payment",
  async ({ paymentId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/pay/${paymentId}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const payment_success = createAsyncThunk(
  "payment/payment_success",
  async ({ id, formData,sellerId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/sucesspayment/${id}/${sellerId}`, formData);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_statusgpayment = createAsyncThunk(
  "payment/get_statusgpayment",
  async ({ userId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_statusgpayment/${userId}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//success_payment
export const success_paymentI = createAsyncThunk(
  "payment/success_payment",
  async ({ userId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_status_successpayment/${userId}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const paymentReducer = createSlice({
  name: "payment",
  initialState: {
    loader: false,
    payments: [],
    payment_count: 0,
    errorMessage: "",
    successMessage: "",
    ////
    pay: [],
    ///status_payment
    statusgpayment: [],
    ///success_payment
    success_payment: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_payment.fulfilled, (state, { payload }) => {
        state.payments = payload.waitpayment;
        state.payment_count = payload.payment_count;
      })
      .addCase(get_payment_profile.fulfilled, (state, { payload }) => {
        state.pay = payload.pay;
      })
      .addCase(get_statusgpayment.fulfilled, (state, { payload }) => {
        state.statusgpayment = payload.statusgpayment;
      })
      .addCase(payment_success.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(payment_success.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(payment_success.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
      })

      .addCase(success_paymentI.fulfilled, (state, { payload }) => {
        state.success_payment = payload.success_payment;
      });
  },
});
export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer;
