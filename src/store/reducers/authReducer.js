import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";
const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token);
    return userInfo;
  } else {
    return "";
  }
};
export const register = createAsyncThunk(
  "auth/register-customer",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/register-customer", info, {
        withCredentials: true,
      });
      localStorage.setItem("customerToken", data.token);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login-customer",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/login-customer", info, {
        withCredentials: true,
      });
      localStorage.setItem("customerToken", data.token);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method
export const edit_profile = createAsyncThunk(
  "auth/edit_profile",
  async ({ userId, formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/edit_profile/${userId}`, formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method
export const get_profile_customer = createAsyncThunk(
  "auth/get_profile_customer",
  async ({ id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get_customer/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// //logout
// export const logout_customer = createAsyncThunk(
//   "auth/logout_customer",
//   async (_, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.post(`/logout`, {
//         withCredentials: true,
//       });
//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const authMiddlewares = createAsyncThunk(
//   "auth/authMiddlewares",
//   async (_, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.get(`/authMiddlewares`, {
//         withCredentials: true,
//       });
//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: decodeToken(localStorage.getItem("customerToken")),
    errorMessage: "",
    successMessage: "",
    get_customer: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.userInfo = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })
      .addCase(login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const userInfo = decodeToken(payload.token);
        state.successMessage = payload.message;
        state.loader = false;
        state.userInfo = userInfo;
      })
      ///edit_profile
      .addCase(edit_profile.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(edit_profile.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        state.loader = false;
      })
      .addCase(edit_profile.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.loader = false;
      })
      .addCase(get_profile_customer.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.get_customer = payload.data;
      })
      // .addCase(logout_customer.pending, (state, { payload }) => {
      //   state.loader = true;
      // })
      // .addCase(logout_customer.rejected, (state, { payload }) => {
      //   state.errorMessage = payload.message;
      //   state.loader = false;
      // })
      // .addCase(logout_customer.fulfilled, (state, { payload }) => {
      //   state.successMessage = payload.message;
      //   state.loader = false;
      // })
      // .addCase(authMiddlewares.rejected, (state, { payload }) => {
      //   state.successMessage = payload.message;
      //   state.loader = false;
      // })
      ;
  },
});
export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
