import { combineReducers, configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import starsReducer from './slices/starsSlice';
import authReducer from './slices/authSlice';
import selectedStarsReducer from './slices/selectedStarsSlice';

const store = configureStore({
  reducer: combineReducers({
    filter: filterReducer,
    stars: starsReducer,
    auth: authReducer,
    selectedStars: selectedStarsReducer,
  }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

