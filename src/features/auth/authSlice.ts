import { IUser, UserRole } from '@/interfaces/userInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  accessToken: string | null;
  user: IUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
