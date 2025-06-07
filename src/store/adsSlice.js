import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adsService from '../services/adsService';

const initialState = {
  ads: [],
  ad: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Ottieni tutti gli annunci
export const getAds = createAsyncThunk(
  'ads/getAll',
  async (_, thunkAPI) => {
    try {
      return await adsService.getAds();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Ottieni un annuncio specifico
export const getAdById = createAsyncThunk(
  'ads/getById',
  async (id, thunkAPI) => {
    try {
      return await adsService.getAdById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Crea un nuovo annuncio
export const createAd = createAsyncThunk(
  'ads/create',
  async (adData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await adsService.createAd(adData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Aggiorna un annuncio
export const updateAd = createAsyncThunk(
  'ads/update',
  async ({ id, adData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await adsService.updateAd(id, adData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Elimina un annuncio
export const deleteAd = createAsyncThunk(
  'ads/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      await adsService.deleteAd(id, token);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads = action.payload;
      })
      .addCase(getAds.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAdById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ad = action.payload;
      })
      .addCase(getAdById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads.push(action.payload);
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads = state.ads.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        );
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads = state.ads.filter((ad) => ad.id !== action.payload);
      });
  },
});

export const { reset } = adsSlice.actions;
export default adsSlice.reducer;
