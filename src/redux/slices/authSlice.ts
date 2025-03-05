import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  googleEmail: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  googleEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setGoogleEmail(state, action: PayloadAction<string>) {
      state.googleEmail = action.payload;
    },
    // Optionally, you can add a clear action
    clearAuthState(state) {
      state.accessToken = null;
      state.googleEmail = null;
    },
  },
});

export const { setAccessToken, setGoogleEmail, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
