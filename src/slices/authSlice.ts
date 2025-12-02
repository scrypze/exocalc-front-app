import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import type { ModelLoginReq, ModelRegisterReq } from '../api/Api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    login: string;
    role: string;
    id?: string;
  } | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: null,
  accessToken: localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ModelLoginReq, { rejectWithValue }) => {
    try {
      const response = await api.auth.loginCreate(credentials);
      const { access_token } = response.data;
      
      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка авторизации');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: ModelRegisterReq, { rejectWithValue }) => {
    try {
      const response = await api.auth.registerCreate(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка регистрации');
    }
  }
);

export const registerAstronomer = createAsyncThunk(
  'auth/registerAstronomer',
  async (credentials: ModelRegisterReq, { rejectWithValue }) => {
    try {
      const response = await api.auth.registerAstronomerCreate(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка регистрации астронома');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.auth.getAuth();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка получения данных пользователя');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.auth.logoutCreate();
      localStorage.removeItem('access_token');
      return null;
    } catch (error: any) {
      localStorage.removeItem('access_token');
      return rejectWithValue(error.response?.data?.description || 'Ошибка при выходе');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setToken(state, action) {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('access_token', action.payload);
      } else {
        localStorage.removeItem('access_token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access_token || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAstronomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAstronomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAstronomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        const role = payload.role || payload.Role || '';
        state.user = {
          login: payload.login || payload.Login || '',
          role: role,
          id: payload.UUID || payload.uuid || payload.id || payload.ID || '',
        };
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.accessToken = null;
        localStorage.removeItem('access_token');
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;

