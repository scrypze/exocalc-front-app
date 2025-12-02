import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import type { ModelStar } from '../api/Api';

interface StarsState {
  searchValue: string;
  stars: ModelStar[];
  selectedStar: ModelStar | null;
  loading: boolean;
  error: string | null;
}

const initialState: StarsState = {
  searchValue: '',
  stars: [],
  selectedStar: null,
  loading: false,
  error: null,
};

export const getStarsList = createAsyncThunk(
  'stars/getStarsList',
  async (searchedStar?: string) => {
    const response = await api.stars.starsList({ searchedStar });
    return response.data;
  }
);

export const getStarById = createAsyncThunk(
  'stars/getStarById',
  async (id: number) => {
    const response = await api.stars.starsDetail(id);
    return response.data;
  }
);

const starsSlice = createSlice({
  name: 'stars',
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    clearStars(state) {
      state.stars = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStarsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarsList.fulfilled, (state, action) => {
        state.loading = false;
        state.stars = action.payload.stars || [];
      })
      .addCase(getStarsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке звезд';
      })
      .addCase(getStarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarById.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.selectedStar = (payload.star || payload) as ModelStar;
      })
      .addCase(getStarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке звезды';
      });
  },
});

export const { setSearchValue, clearStars, clearError } = starsSlice.actions;
export default starsSlice.reducer;

