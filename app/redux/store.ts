import { configureStore } from '@reduxjs/toolkit';
import flightReducer from './flightSlice';

export const store = configureStore({
  reducer: {
    flight: flightReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;