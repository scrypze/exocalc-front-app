import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, setAccessToken } from '../api';
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

const initialToken =
  typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;

setAccessToken(initialToken);

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  user: null,
  accessToken: initialToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ModelLoginReq, { rejectWithValue }) => {
    try {
      const response = await api.auth.loginCreate(credentials);
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
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка при выходе');
    }
  }
);

export const updateLogin = createAsyncThunk(
  'auth/updateLogin',
  async (newLogin: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.instance.put('/auth/update-login', { login: newLogin });
      await dispatch(getMe());
      return response.data;
    } catch (error: any) {
      console.error('API error updateLogin:', error);
      const errorMessage = error.response?.data?.description || error.response?.data?.message || error.message || 'Ошибка при изменении логина';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await api.instance.put('/auth/update-password', { 
        old_password: oldPassword, 
        new_password: newPassword 
      });
      return response.data;
    } catch (error: any) {
      console.error('API error updatePassword:', error);
      const errorMessage = error.response?.data?.description || error.response?.data?.message || error.message || 'Ошибка при изменении пароля';
      return rejectWithValue(errorMessage);
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
        const payload = action.payload as any;
        const token = payload.access_token || null;
        state.accessToken = token;
        state.isAuthenticated = !!token;
        setAccessToken(token);
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
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      })
      .addCase(updateLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLogin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;

