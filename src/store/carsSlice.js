import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carsService from '../services/carsService';

const initialState = {
  brands: [],
  models: [],
  selectedBrand: null,
  selectedModel: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Ottieni tutte le marche auto
export const getBrands = createAsyncThunk(
  'cars/getBrands',
  async (_, thunkAPI) => {
    try {
      return await carsService.getBrands();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Ottieni i modelli per una marca specifica
export const getModelsByBrand = createAsyncThunk(
  'cars/getModelsByBrand',
  async (brandId, thunkAPI) => {
    try {
      return await carsService.getModelsByBrand(brandId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Crea una nuova marca auto (solo admin)
export const createBrand = createAsyncThunk(
  'cars/createBrand',
  async (brandData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await carsService.createBrand(brandData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Crea un nuovo modello auto (solo admin)
export const createModel = createAsyncThunk(
  'cars/createModel',
  async ({ brandId, modelData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token;
      return await carsService.createModel(brandId, modelData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Si è verificato un errore';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.brands = action.payload;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getModelsByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getModelsByBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.models = action.payload;
      })
      .addCase(getModelsByBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.brands.push(action.payload);
      })
      .addCase(createModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.models.push(action.payload);
      });
  },
});

export const { reset, setSelectedBrand, setSelectedModel } = carsSlice.actions;
export default carsSlice.reducer;
