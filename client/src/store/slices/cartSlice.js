import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, stock, quantity } = action.payload;
      
      // Check if product already exists in cart
      const existingItem = state.cart.find((item) => item.id === id);
      
      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > stock) {
          toast.error(`Only ${stock} units available`);
          return;
        }
        existingItem.quantity = newQuantity;
        toast.success("Cart updated");
      } else {
        // Add new item to cart
        if (quantity > stock) {
          toast.error(`Only ${stock} units available`);
          return;
        }
        state.cart.push({
          id,
          name,
          price,
          image,
          stock,
          quantity,
        });
        toast.success("Product added to cart");
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      toast.success("Product removed from cart");
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      
      if (item) {
        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} units available`);
          return;
        }
        if (quantity <= 0) {
          state.cart = state.cart.filter((item) => item.id !== id);
          toast.success("Product removed from cart");
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
