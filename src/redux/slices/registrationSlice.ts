import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegistrationState {
  accountType: "individual" | "corporate";
}

const initialState: RegistrationState = {
  accountType: "individual", // default; updated during registration
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setAccountType(state, action: PayloadAction<"individual" | "corporate">) {
      state.accountType = action.payload;
    },
  },
});

export const { setAccountType } = registrationSlice.actions;
export default registrationSlice.reducer;
