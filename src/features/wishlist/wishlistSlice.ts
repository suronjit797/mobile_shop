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
      const foundProduct = state.items.find((i) => i.product._id === action.payload._id);
      console.log({ foundProduct, action });
      if (!foundProduct) {
        state.items.push({ product: action.payload, addedAt: new Date().toISOString() });
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.items = state.items.filter((i) => i.product._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
