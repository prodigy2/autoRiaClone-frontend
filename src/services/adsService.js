import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/ads/`;

// Ottieni tutti gli annunci
const getAds = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Ottieni un annuncio specifico
const getAdById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Crea un nuovo annuncio
const createAd = async (adData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, adData, config);
  return response.data;
};

// Aggiorna un annuncio
const updateAd = async (id, adData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(API_URL + id, adData, config);
  return response.data;
};

// Elimina un annuncio
const deleteAd = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

// Incrementa le visualizzazioni di un annuncio
const incrementViews = async (id) => {
  const response = await axios.post(API_URL + id + '/view');
  return response.data;
};

const adsService = {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  incrementViews,
};

export default adsService;
