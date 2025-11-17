import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface FilterState {
  searchQuery: string;
}

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    searchQuery: '',
  } as FilterState,
  reducers: {
    setSearchQuery(state, { payload }: { payload: string }) {
      state.searchQuery = payload;
    },
    clearSearchQuery(state) {
      state.searchQuery = '';
    },
  },
});

export const useSearchQuery = () =>
  useSelector((state: RootState) => state.filter.searchQuery);

export const {
  setSearchQuery: setSearchQueryAction,
  clearSearchQuery: clearSearchQueryAction,
} = filterSlice.actions;

export default filterSlice.reducer;


