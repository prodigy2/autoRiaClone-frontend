import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions,
  Button, TextField, MenuItem, FormControl, InputLabel, Select, Pagination, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAds } from '../store/adsSlice';
import { getBrands, getModelsByBrand } from '../store/carsSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ads, isLoading } = useSelector((state) => state.ads);
  const { brands } = useSelector((state) => state.cars);

  const [searchParams, setSearchParams] = useState({
    brand: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
  });

  const [models, setModels] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [page, setPage] = useState(1);
  const adsPerPage = 6;

  useEffect(() => {
    dispatch(getAds());
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (ads) {
      setFilteredAds(Array.isArray(ads) ? ads : []);
    }
  }, [ads]);

  useEffect(() => {
    if (searchParams.brand) {
      dispatch(getModelsByBrand(searchParams.brand)).then((action) => {
        if (action.payload) setModels(action.payload);
      });
    } else {
      setModels([]);
      setSearchParams((prev) => ({ ...prev, model: '' }));
    }
  }, [searchParams.brand, dispatch]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { model: '' } : {}),
    }));
  };

  const handleSearch = () => {
    let filtered = Array.isArray(ads) ? [...ads] : [];

    if (searchParams.brand) {
      filtered = filtered.filter(
        (ad) => ad.model?.brand?.id === searchParams.brand
      );
    }
    if (searchParams.model) {
      filtered = filtered.filter(
        (ad) => ad.model?.id === searchParams.model
      );
    }
    if (searchParams.priceMin) {
      filtered = filtered.filter(
        (ad) => Number(ad.price) >= Number(searchParams.priceMin)
      );
    }
    if (searchParams.priceMax) {
      filtered = filtered.filter(
        (ad) => Number(ad.price) <= Number(searchParams.priceMax)
      );
    }
    if (searchParams.yearMin) {
      filtered = filtered.filter(
        (ad) => Number(ad.year) >= Number(searchParams.yearMin)
      );
    }
    if (searchParams.yearMax) {
      filtered = filtered.filter(
        (ad) => Number(ad.year) <= Number(searchParams.yearMax)
      );
    }

    setFilteredAds(filtered);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewAd = (id) => {
    navigate(`/cars/${id}`);
  };

  // Calcola gli annunci da mostrare nella pagina corrente
  const indexOfLastAd = page * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

  // Funzione per ottenere l'URL dell'immagine
  const getImageUrl = (ad) => {
    if (ad?.images && ad.images.length > 0) {
      const img = ad.images[0];
      if (typeof img === 'string') return img;
      if (img && img.url) return img.url;
    }
    return 'https://placehold.co/300x200?text=Nessuna+immagine';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Benvenuto su AutoRia Clone
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Trova la tua prossima auto tra centinaia di annunci selezionati!
        </Typography>
      </Box>

      {/* Sezione di ricerca */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="brand-label">Marca</InputLabel>
              <Select
                labelId="brand-label"
                id="brand"
                name="brand"
                value={searchParams.brand}
                label="Marca"
                onChange={handleSearchChange}
              >
                <MenuItem value="">
                  <em>Tutte</em>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="model-label">Modello</InputLabel>
              <Select
                labelId="model-label"
                id="model"
                name="model"
                value={searchParams.model}
                label="Modello"
                onChange={handleSearchChange}
                disabled={!searchParams.brand}
              >
                <MenuItem value="">
                  <em>Tutti</em>
                </MenuItem>
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Prezzo min"
              name="priceMin"
              type="number"
              value={searchParams.priceMin}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Prezzo max"
              name="priceMax"
              type="number"
              value={searchParams.priceMax}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={6} sm={1}>
            <TextField
              label="Anno min"
              name="yearMin"
              type="number"
              value={searchParams.yearMin}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
            />
          </Grid>
          <Grid item xs={6} sm={1}>
            <TextField
              label="Anno max"
              name="yearMax"
              type="number"
              value={searchParams.yearMax}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              fullWidth
              sx={{ minWidth: 120 }}
            >
              Cerca
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Sezione annunci */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h2" gutterBottom>
            Annunci in evidenza
          </Typography>
          {currentAds.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {currentAds.map((ad) => (
                  <Grid item xs={12} sm={6} md={4} key={ad.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(ad)}
                        alt={ad.title}
                      />
                      <CardContent>
                        <Typography variant="h6">
                          {ad.model?.brand?.name || 'Marca sconosciuta'} {ad.model?.name || 'Modello sconosciuto'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ad.year} &bull; {ad.mileage} km
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                          {ad.price} {ad.currency}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {ad.title}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleViewAd(ad?.id)}>Visualizza</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(filteredAds.length / adsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1" align="center" sx={{ my: 4 }}>
              Nessun annuncio trovato. Prova a modificare i filtri di ricerca.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default HomePage;