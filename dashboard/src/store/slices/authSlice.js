import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      // Reject non-admin users - they should only use the client frontend
      if (response.data.user && response.data.user.role !== "Admin") {
        return rejectWithValue("Only admin accounts can access the dashboard. Please use the client frontend.");
      }
      toast.success(response.data.message || "Login successful");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      // Reject non-admin users - they should only use the client frontend
      if (response.data.user && response.data.user.role !== "Admin") {
        return rejectWithValue("Only admin accounts can access the dashboard. Please use the client frontend.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      toast.success(response.data.message || "Logged out successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Profile updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth/password/update",
        passwordData
      );
      toast.success(response.data.message || "Password updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/password/forgot", {
        email,
      });
      toast.success(
        response.data.message || "Password reset email sent successfully"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, passwordData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/auth/password/reset/${token}`,
        passwordData
      );
      toast.success(response.data.message || "Password reset successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    isLoggingIn: false,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        // Only set user if it's an admin
        const user = action.payload.user;
        if (user && user.role === "Admin") {
          state.user = user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        toast.error(action.payload || "Login failed");
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        // Only set user if it's an admin
        const user = action.payload.user;
        if (user && user.role === "Admin") {
          state.user = user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
        // Show error message if it's a role mismatch
        if (action.payload && typeof action.payload === "string" && action.payload !== null) {
          toast.error(action.payload);
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user || state.user;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to update password");
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
