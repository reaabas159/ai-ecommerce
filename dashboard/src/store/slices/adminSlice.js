import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/fetch/dashboard-stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/getallusers?page=${page}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(`/admin/delete/${userId}`);
      toast.success(response.data.message || "User deleted successfully");
      dispatch(fetchAllUsers(1));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    totalUsers: 0,
    users: [],
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    totalUsersCount: 0,
    monthlySales: [],
    orderStatusCounts: {},
    topSellingProducts: [],
    lowStockProducts: [],
    revenueGrowth: "",
    newUsersThisMonth: 0,
    currentMonthSales: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalRevenueAllTime = action.payload.totalRevenueAllTime || 0;
        state.todayRevenue = action.payload.todayRevenue || 0;
        state.yesterdayRevenue = action.payload.yesterdayRevenue || 0;
        state.totalUsersCount = action.payload.totalUsersCount || 0;
        state.monthlySales = action.payload.monthlySales || [];
        state.orderStatusCounts = action.payload.orderStatusCounts || {};
        state.topSellingProducts = action.payload.topSellingProducts || [];
        state.lowStockProducts = action.payload.lowStockProducts || [];
        state.revenueGrowth = action.payload.revenueGrowth || "0%";
        state.newUsersThisMonth = action.payload.newUsersThisMonth || 0;
        state.currentMonthSales = action.payload.currentMonthSales || 0;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to fetch dashboard stats");
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.totalUsers = action.payload.totalUsers || 0;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to fetch users");
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to delete user");
      });
  },
});

export default adminSlice.reducer;
