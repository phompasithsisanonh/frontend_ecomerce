import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const followingAdd = createAsyncThunk(
  "following/followingReducer",
  async ({ userId, followSellerId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/follow`, { userId, followSellerId },{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const following_get = createAsyncThunk(
  "following/following_get ",
  async ({ userId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-follow/${userId}`,{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unfollowing = createAsyncThunk(
  "following/unfollowing",
  async (
    { userId, unfollowSellerId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(`/unfollow`, {
        userId,
        unfollowSellerId,
      },{
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const followingReducer = createSlice({
  name: "following",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
    following_data: [],
    countfollowing:0,
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(followingAdd.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(followingAdd.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(followingAdd.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(following_get.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.following_data = payload.following;
      })

      .addCase(unfollowing.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(unfollowing.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(unfollowing.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      });
  },
});
export const { messageClear } = followingReducer.actions;
export default followingReducer.reducer;
