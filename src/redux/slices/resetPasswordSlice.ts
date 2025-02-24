import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResetPasswordState {
  resetEmail: string | null;
}

const initialState: ResetPasswordState = {
  resetEmail: null,
};

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    setResetEmail(state, action: PayloadAction<string>) {
      state.resetEmail = action.payload;
    },
    clearResetEmail(state) {
      state.resetEmail = null;
    },
  },
});

export const { setResetEmail, clearResetEmail } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
