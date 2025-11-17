import { combineReducers, configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';

const store = configureStore({
  reducer: combineReducers({
    filter: filterReducer,
  }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

