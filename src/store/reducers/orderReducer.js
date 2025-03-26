import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const place_order = createAsyncThunk(
  "order/place_order",
  async ({
    price,
    products,
    shipping_fee,
    items,
    shippingInfo,
    userId,
    couponCode,
    navigate,
  },{ rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/order-add", {
        price, //ລາຄາ
        products, //ສິນຄ້າ
        items, //ລາຍການສິນຄ້າ
        shippingInfo, //ຂໍ້ມູນການຈັດສົ່ງ
        userId, //ຜູ້ໃຊ້
        navigate,
        couponCode
      });

      navigate("/payment", {
        state: {
          price: price ,
          items,
          orderId: data.orderId,
          shippingInfo,
          products,
        },
      });
      return fulfillWithValue(data);
    } catch (error) {

      return rejectWithValue(error.response.data);
    }
  }
);
export const get_orders = createAsyncThunk(
  "order/get_orders",
  async ({ customerId, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-orders/${customerId}/${status}`);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
///ຫາໄອດີເພື່ອບໍ່ສາມາດຊື້ໄໄດ້
export const get_found = createAsyncThunk(
  "order/get_found",
  async ({ get_id}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/get_found`,{ get_id});
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const delete_customer_order = createAsyncThunk(
  "order/delete_customer_order",
  async ({id}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/delete_customer_order/${id}`,);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const orderReducer = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    errorMessage: "",
    successMessage: "",
    myOrder: {},
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(place_order.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(place_order.rejected, (state, { payload }) => {
        state.errorMessage = payload?.message;
        state.loader = false;
      })
      .addCase(place_order.fulfilled, (state, { payload }) => {
        state.successMessage = payload?.message;
        state.loader = false;
      })
      .addCase(get_orders.fulfilled, (state, { payload }) => {
        state.myOrders = payload.orders;
      })
      .addCase(get_found.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(get_found.rejected, (state, { payload }) => {
        state.errorMessage = payload?.message;
        state.loader = false;
      })
      .addCase(get_found.fulfilled, (state, { payload }) => {
        state.successMessage = payload?.message;
        state.loader = false;
      })
      .addCase(delete_customer_order.fulfilled, (state, { payload }) => {
        state.successMessage = payload?.message;
        state.loader = false;
      })
      ;
  },
}); 
export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
