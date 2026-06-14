import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import envConfig from "@/config/envConfig";
import { mainApi } from "./mainApi";

const encrypt = encryptTransform({
  secretKey: envConfig.VITE_REDUX_STORAGE_SECRET_KEY,
  onError: (error) => console.log("Persist encrypt error:", error),
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist"],
  blacklist: ["api"],
  transforms: [encrypt],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  [mainApi.reducerPath]: mainApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).concat(mainApi.middleware as any),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
