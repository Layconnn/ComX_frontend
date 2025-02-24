/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CorporateRegistrationStep1 {
  companyName: string;
  businessType: string;
  dateOfIncorporation: string;
}

interface CorporateRegistrationStep2 {
  companyEmail: string;
}

interface CorporateRegistrationState {
  corporateStep1?: CorporateRegistrationStep1;
  corporateStep2?: CorporateRegistrationStep2;
}

const initialState: CorporateRegistrationState = {};

const corporateRegistrationSlice = createSlice({
  name: 'corporateRegistration',
  initialState,
  reducers: {
    setCorporateRegistrationStep1(
      state,
      action: PayloadAction<CorporateRegistrationStep1>
    ) {
      state.corporateStep1 = action.payload;
    },
    setCorporateRegistrationStep2(
      state,
      action: PayloadAction<CorporateRegistrationStep2>
    ) {
      state.corporateStep2 = action.payload;
    },
    resetRegistration(_state) {
      return initialState;
    },
  },
});

export const {
  setCorporateRegistrationStep1,
  setCorporateRegistrationStep2,
  resetRegistration,
} = corporateRegistrationSlice.actions;

export default corporateRegistrationSlice.reducer;
