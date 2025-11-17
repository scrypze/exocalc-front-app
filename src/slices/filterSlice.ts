import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface FilterState {
  searchQuery: string;
  massRange: {
    min: string;
    max: string;
  };
}

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    searchQuery: '',
    massRange: {
      min: '',
      max: '',
    },
  } as FilterState,
  reducers: {
    setSearchQuery(state, { payload }: { payload: string }) {
      state.searchQuery = payload;
    },
    clearSearchQuery(state) {
      state.searchQuery = '';
    },
    setMassRange(
      state,
      { payload }: { payload: { min: string; max: string } }
    ) {
      state.massRange = payload;
    },
  },
});

export const useSearchQuery = () =>
  useSelector((state: RootState) => state.filter.searchQuery);

export const useMassRange = () =>
  useSelector((state: RootState) => state.filter.massRange);

export const {
  setSearchQuery: setSearchQueryAction,
  clearSearchQuery: clearSearchQueryAction,
  setMassRange: setMassRangeAction,
} = filterSlice.actions;

export default filterSlice.reducer;


