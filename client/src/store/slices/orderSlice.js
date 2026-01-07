import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Place new order
export const placeNewOrder = createAsyncThunk(
  "order/placeNew",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/order/new", orderData);
      toast.success(response.data.message || "Order placed successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

// Fetch my orders
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/orders/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch single order
export const fetchSingleOrder = createAsyncThunk(
  "order/fetchSingle",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
    singleOrder: null,
  },
  reducers: {
    setOrderStep: (state, action) => {
      state.orderStep = action.payload;
    },
    clearOrder: (state) => {
      state.finalPrice = null;
      state.paymentIntent = "";
      state.orderStep = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place new order
      .addCase(placeNewOrder.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.finalPrice = action.payload.total_price;
        state.paymentIntent = action.payload.paymentIntent;
        state.orderStep = 2;
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.placingOrder = false;
        toast.error(action.payload || "Failed to place order");
      })
      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload.myOrders || [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        toast.error(action.payload || "Failed to fetch orders");
      })
      // Fetch single order
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.singleOrder = action.payload.orders || null;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        toast.error(action.payload || "Failed to fetch order");
      });
  },
});

export const { setOrderStep, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
