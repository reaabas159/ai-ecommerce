import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      toast.success(response.data.message || "Registration successful");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      // Reject admin users - they should only use the admin dashboard
      if (response.data.user && response.data.user.role === "Admin") {
        return rejectWithValue("Admin accounts cannot access the client frontend. Please use the admin dashboard.");
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
      // Reject admin users - they should only use the admin dashboard
      if (response.data.user && response.data.user.role === "Admin") {
        return rejectWithValue("Admin accounts cannot access the client frontend. Please use the admin dashboard.");
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
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  reducers: {
    clearAuth: (state) => {
      state.authUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        // Only set user if it's not an admin (shouldn't happen with registration, but safety check)
        const user = action.payload.user;
        if (user && user.role !== "Admin") {
          state.authUser = user;
        } else {
          state.authUser = null;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isSigningUp = false;
        toast.error(action.payload || "Registration failed");
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        // Only set user if it's not an admin
        const user = action.payload.user;
        if (user && user.role !== "Admin") {
          state.authUser = user;
        } else {
          state.authUser = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        toast.error(action.payload || "Login failed");
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        // Only set user if it's not an admin
        const user = action.payload.user;
        if (user && user.role !== "Admin") {
          state.authUser = user;
        } else {
          state.authUser = null;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload.user || state.authUser;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        toast.error(action.payload || "Failed to update profile");
      })
      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        toast.error(action.payload || "Failed to update password");
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
