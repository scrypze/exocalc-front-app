import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface SelectedStar {
  id?: number;
  status?: string;
  created_at?: string;
  scientist_name?: string;
  calculation_date?: string;
  stars?: any[];
  calculate_exoplanets?: any[];
}

interface SelectedStarsState {
  currentDraftId: number | null;
  count: number;
  selectedStars: SelectedStar | null;
  allSelectedStars: SelectedStar[];
  loading: boolean;
  error: string | null;
}

const initialState: SelectedStarsState = {
  currentDraftId: null,
  count: 0,
  selectedStars: null,
      allSelectedStars: [],
  loading: false,
  error: null,
};

export const createDraftSelectedStars = createAsyncThunk(
  'selectedStars/createDraft',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.selectedStarsCreate();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка создания заявки');
    }
  }
);

export const getSelectedStarsCount = createAsyncThunk(
  'selectedStars/getCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.countList();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка получения количества');
    }
  }
);

export const getSelectedStarsById = createAsyncThunk(
  'selectedStars/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.selectedStarsDetail(id);
      console.log('API Response for getSelectedStarsById:', response.data);
      
      const apiData = (response.data as any)['selected-stars'] || response.data;
      console.log('Extracted apiData:', apiData);
      
      return apiData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка получения заявки');
    }
  }
);

export const addStarToSelected = createAsyncThunk(
  'selectedStars/addStar',
  async (starId: number, { rejectWithValue }) => {
    try {
      await api.selectedStars.addStarCreate(starId);
      return starId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка добавления звезды');
    }
  }
);

export const removeStarFromSelected = createAsyncThunk(
  'selectedStars/removeStar',
  async (starId: number, { rejectWithValue }) => {
    try {
      await api.calculateExoplanets.removeStarDelete(starId);
      return starId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления звезды');
    }
  }
);

export const updateSelectedStars = createAsyncThunk(
  'selectedStars/update',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.selectedStarsUpdate(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления заявки');
    }
  }
);

export const formSelectedStars = createAsyncThunk(
  'selectedStars/form',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.formUpdate(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка формирования заявки');
    }
  }
);

export const moderateSelectedStars = createAsyncThunk(
  'selectedStars/moderate',
  async ({ id, status, moderatorId }: { id: number; status: string; moderatorId: string }, { rejectWithValue }) => {
    try {
      const action = status === 'completed' ? 'complete' : 'decline';
      const response = await api.selectedStars.moderateUpdate(id, { action, moderator_id: moderatorId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка модерации заявки');
    }
  }
);

export const deleteSelectedStars = createAsyncThunk(
  'selectedStars/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.selectedStars.selectedStarsDelete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления заявки');
    }
  }
);

export const getAllSelectedStars = createAsyncThunk(
  'selectedStars/getAll',
  async (filters: { date_from?: string; date_to?: string; status?: string } | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await api.selectedStars.selectedStarsList(filters);
      console.log('getAllSelectedStars API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('getAllSelectedStars error:', error);
      return rejectWithValue(error.response?.data?.description || 'Ошибка получения списка заявок');
    }
  }
);

export const updateStarComment = createAsyncThunk(
  'selectedStars/updateComment',
  async ({ selectedStarsId, starId, comment }: { selectedStarsId: number; starId: number; comment: string }, { rejectWithValue }) => {
    try {
      await api.calculateExoplanets.updateStarCommentUpdate(
        { selected_stars_id: selectedStarsId, star_id: starId },
        { comment }
      );
      return { starId, comment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления комментария');
    }
  }
);

const selectedStarsSlice = createSlice({
  name: 'selectedStars',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setCurrentDraftId(state, action) {
      state.currentDraftId = action.payload;
    },
    clearSelectedStars(state) {
      state.selectedStars = null;
      state.currentDraftId = null;
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDraftSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraftSelectedStars.fulfilled, (state, action) => {
        state.loading = false;
        const data = (action.payload as any)['selected-stars'] || action.payload;
        state.currentDraftId = data.ID || data.id || null;
        state.selectedStars = data;
      })
      .addCase(createDraftSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSelectedStarsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedStarsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count || 0;
        state.currentDraftId = action.payload.selected_stars_id || null;
      })
      .addCase(getSelectedStarsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getSelectedStarsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedStarsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStars = action.payload;
      })
      .addCase(getSelectedStarsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addStarToSelected.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStarToSelected.fulfilled, (state) => {
        state.loading = false;
        state.count += 1;
      })
      .addCase(addStarToSelected.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeStarFromSelected.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStarFromSelected.fulfilled, (state) => {
        state.loading = false;
        if (state.count > 0) {
          state.count -= 1;
        }
      })
      .addCase(removeStarFromSelected.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSelectedStars.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStars = action.payload;
      })
      .addCase(updateSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(formSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formSelectedStars.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStars = action.payload;
        state.currentDraftId = null;
        state.count = 0;
      })
      .addCase(formSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(moderateSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moderateSelectedStars.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.selectedStars = payload['selected-stars'] || payload;
      })
      .addCase(moderateSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSelectedStars.fulfilled, (state) => {
        state.loading = false;
        state.selectedStars = null;
        state.currentDraftId = null;
        state.count = 0;
      })
      .addCase(deleteSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllSelectedStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSelectedStars.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.allSelectedStars = payload['selected-stars'] || payload.selected_stars || [];
      })
      .addCase(getAllSelectedStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStarComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStarComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStarComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentDraftId, clearSelectedStars } = selectedStarsSlice.actions;
export default selectedStarsSlice.reducer;

