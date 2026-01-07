import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1 } = params;
      const response = await axiosInstance.get(`/product/?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Create product
export const createNewProduct = createAsyncThunk(
  "product/create",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        "/product/admin/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Product created successfully");
      dispatch(fetchAllProducts());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ productData, productId }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      const response = await axiosInstance.put(
        `/product/admin/update/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Product updated successfully");
      dispatch(fetchAllProducts());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.delete(
        `/product/admin/delete/${productId}`
      );
      toast.success(response.data.message || "Product deleted successfully");
      dispatch(fetchAllProducts());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to fetch products");
      })
      .addCase(createNewProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to create product");
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to update product");
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || "Failed to delete product");
      });
  },
});

export default productSlice.reducer;
