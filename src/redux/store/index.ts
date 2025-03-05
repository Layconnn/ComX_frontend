import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/authSlice';
import registrationReducer from '../slices/registrationSlice';
import corporateRegistrationReducer from '../slices/corporateRegistrationSlice';
import individualRegistrationReducer from '../slices/individualRegistrationSlice';
import resetPasswordReducer from '../slices/resetPasswordSlice';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'registration', 'individualRegistration', 'corporateRegistration', 'resetPassword'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  corporateRegistration: corporateRegistrationReducer,
  individualRegistration: individualRegistrationReducer,
  resetPassword: resetPasswordReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState> & { _persist?: { rehydrated: boolean } };
export type AppDispatch = typeof store.dispatch;
