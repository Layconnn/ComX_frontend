/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IndividualRegistrationStep1 {
  firstName: string;
  lastName: string;
  email: string;
}

interface IndividualRegistrationStep2 {
  email: string;
}

interface individualRegistrationState {
  individualStep1?: IndividualRegistrationStep1;
  individualStep2?: IndividualRegistrationStep2;
}

const initialState: individualRegistrationState = {};

const individualRegistrationSlice = createSlice({
  name: "individualRegistration",
  initialState,
  reducers: {
    setIndividualRegistrationStep1(
      state,
      action: PayloadAction<IndividualRegistrationStep1>
    ) {
      state.individualStep1 = action.payload;
    },
    setIndividualRegistrationStep2(
      state,
      action: PayloadAction<IndividualRegistrationStep2>
    ) {
      state.individualStep2 = action.payload;
    },
    resetRegistration(_state) {
      return initialState;
    },
  },
});

export const {
    setIndividualRegistrationStep1,
    setIndividualRegistrationStep2,
    resetRegistration,
} = individualRegistrationSlice.actions;

export default individualRegistrationSlice.reducer;