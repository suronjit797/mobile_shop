import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "@/interfaces/product.interface";
import { WishlistItem } from "@/interfaces/globalInterface";

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProduct>) => {
      if (!state.items.find((i) => i.product.id === action.payload.id)) {
        state.items.push({ product: action.payload, addedAt: new Date().toISOString() });
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
