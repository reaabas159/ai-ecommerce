import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch all products with filters
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { category, search, price, ratings, availability, page = 1 } = params;
      const queryParams = new URLSearchParams();
      if (category) queryParams.append("category", category);
      if (search) queryParams.append("search", search);
      if (price) queryParams.append("price", price);
      if (ratings) queryParams.append("ratings", ratings);
      if (availability) queryParams.append("availability", availability);
      queryParams.append("page", page);

      const response = await axiosInstance.get(
        `/product/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch single product
export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingle",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/product/singleProduct/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// AI Search
export const aiSearchProducts = createAsyncThunk(
  "product/aiSearch",
  async (userPrompt, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/product/ai-search", {
        userPrompt,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "AI search failed"
      );
    }
  }
);

// Post review
export const postReview = createAsyncThunk(
  "product/postReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        { rating, comment }
      );
      return { productId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to post review"
      );
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/product/delete/review/${productId}`
      );
      return { productId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to fetch products");
      })
      // Fetch single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload.product || {};
        state.productReviews = action.payload.product?.reviews || [];
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to fetch product");
      })
      // AI Search
      .addCase(aiSearchProducts.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(aiSearchProducts.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(aiSearchProducts.rejected, (state, action) => {
        state.aiSearching = false;
        toast.error(action.payload || "AI search failed");
      })
      // Post review
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        if (state.productDetails.id === action.payload.productId) {
          // Refresh product details to get updated reviews
          // This will be handled by refetching
        }
        toast.success("Review posted successfully");
      })
      .addCase(postReview.rejected, (state, action) => {
        state.isPostingReview = false;
        toast.error(action.payload || "Failed to post review");
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        toast.success("Review deleted successfully");
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isReviewDeleting = false;
        toast.error(action.payload || "Failed to delete review");
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
