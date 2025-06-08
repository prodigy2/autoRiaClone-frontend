import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../config/api';

// Helper per ottenere l'header di autorizzazione
const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return {};
  try {
    const userObj = JSON.parse(userStr);
    const token = userObj.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

// Thunk per ottenere tutte le ads
export const getAds = createAsyncThunk('ads/getAds', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ads`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nel caricamento annunci');
  }
});

// Thunk per ottenere una ad per id
export const getAdById = createAsyncThunk('ads/getAdById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ads/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nel caricamento annuncio');
  }
});

// Thunk per eliminare una ad
export const deleteAd = createAsyncThunk('ads/deleteAd', async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_BASE_URL}/ads/${id}`, {
      headers: getAuthHeader(),
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nell\'eliminazione annuncio');
  }
});

// Thunk per aggiornare una ad
export const updateAd = createAsyncThunk('ads/updateAd', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/ads/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nell\'aggiornamento annuncio');
  }
});

// Thunk per ottenere marche e modelli
export const getBrands = createAsyncThunk('ads/getBrands', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/brands`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nel caricamento marche');
  }
});

// Thunk per creare una nuova ad
export const createAd = createAsyncThunk('ads/createAd', async (adData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ads`, adData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Errore nella creazione annuncio');
  }
});

const initialState = {
  ads: [],
  ad: null,
  brands: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const adsSlice = createSlice({
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
      // getAds
      .addCase(getAds.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload;
      })
      .addCase(getAds.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // getAdById
      .addCase(getAdById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getAdById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ad = action.payload;
      })
      .addCase(getAdById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // deleteAd
      .addCase(deleteAd.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = state.ads.filter((ad) => ad.id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // updateAd
      .addCase(updateAd.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads = state.ads.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        );
        state.ad = action.payload;
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // getBrands
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // createAd
      .addCase(createAd.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ads.push(action.payload);
      })
      .addCase(createAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = adsSlice.actions;
export default adsSlice.reducer;