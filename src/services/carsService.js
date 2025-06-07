import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/cars/`;

// Ottieni tutte le marche auto
const getBrands = async () => {
  const response = await axios.get(API_URL + 'brands');
  return response.data;
};

// Ottieni un brand specifico
const getBrandById = async (brandId) => {
  const response = await axios.get(API_URL + 'brands/' + brandId);
  return response.data;
};

// Ottieni i modelli per una marca specifica
const getModelsByBrand = async (brandId) => {
  const response = await axios.get(API_URL + 'brands/' + brandId + '/models');
  return response.data;
};

// Ottieni un modello specifico
const getModelById = async (modelId) => {
  const response = await axios.get(API_URL + 'models/' + modelId);
  return response.data;
};

// Crea una nuova marca auto (solo admin)
const createBrand = async (brandData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'brands', brandData, config);
  return response.data;
};

// Crea un nuovo modello auto (solo admin)
const createModel = async (brandId, modelData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + 'brands/' + brandId + '/models', modelData, config);
  return response.data;
};

const carsService = {
  getBrands,
  getBrandById,
  getModelsByBrand,
  getModelById,
  createBrand,
  createModel,
};

export default carsService;
