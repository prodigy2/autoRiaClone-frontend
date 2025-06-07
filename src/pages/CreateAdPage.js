import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, Divider, Alert } from '@mui/material';
import { createAd } from '../store/adsSlice';
import { getBrands, getModelsByBrand } from '../store/carsSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Titolo è obbligatorio'),
  description: yup
    .string()
    .required('Descrizione è obbligatoria')
    .min(50, 'La descrizione deve contenere almeno 50 caratteri'),
  price: yup
    .number()
    .required('Prezzo è obbligatorio')
    .positive('Il prezzo deve essere positivo'),
  brandId: yup
    .string()
    .required('Marca è obbligatoria'),
  modelId: yup
    .string()
    .required('Modello è obbligatorio'),
  year: yup
    .number()
    .required('Anno è obbligatorio')
    .integer('L\'anno deve essere un numero intero')
    .min(1900, 'L\'anno deve essere successivo al 1900')
    .max(new Date().getFullYear(), `L'anno non può essere successivo a ${new Date().getFullYear()}`),
  mileage: yup
    .number()
    .required('Chilometraggio è obbligatorio')
    .integer('Il chilometraggio deve essere un numero intero')
    .min(0, 'Il chilometraggio deve essere positivo'),
  fuelType: yup
    .string()
    .required('Tipo di carburante è obbligatorio'),
  transmission: yup
    .string()
    .required('Tipo di cambio è obbligatorio'),
  power: yup
    .number()
    .required('Potenza è obbligatoria')
    .positive('La potenza deve essere positiva'),
  engineSize: yup
    .number()
    .required('Cilindrata è obbligatoria')
    .positive('La cilindrata deve essere positiva'),
  color: yup
    .string()
    .required('Colore è obbligatorio'),
  location: yup
    .string()
    .required('Località è obbligatoria'),
});

const CreateAdPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { brands, models, isLoading: carsLoading } = useSelector((state) => state.cars);
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.ads);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }

    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isError, isSuccess, navigate]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      brandId: '',
      modelId: '',
      year: new Date().getFullYear(),
      mileage: '',
      fuelType: '',
      transmission: '',
      power: '',
      engineSize: '',
      color: '',
      location: '',
      images: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const adData = {
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
        car: {
          brandId: values.brandId,
          modelId: values.modelId,
          year: parseInt(values.year),
          mileage: parseInt(values.mileage),
          fuelType: values.fuelType,
          transmission: values.transmission,
          power: parseInt(values.power),
          engineSize: parseInt(values.engineSize),
          color: values.color,
        },
        location: values.location,
        images: values.images,
      };
      
      dispatch(createAd(adData));
    },
  });

  useEffect(() => {
    if (formik.values.brandId) {
      dispatch(getModelsByBrand(formik.values.brandId));
    }
  }, [formik.values.brandId, dispatch]);

  const fuelTypes = [
    'Benzina',
    'Diesel',
    'GPL',
    'Metano',
    'Elettrica',
    'Ibrida',
    'Ibrida Plug-in',
  ];

  const transmissionTypes = [
    'Manuale',
    'Automatica',
    'Semiautomatica',
    'CVT',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crea nuovo annuncio
      </Typography>
      
      {showError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setShowError(false)}>
          {message || 'Si è verificato un errore durante la creazione dell\'annuncio. Riprova.'}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Informazioni generali
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Titolo annuncio"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Prezzo (€)"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Località"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Descrizione"
                multiline
                rows={6}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            Dettagli veicolo
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.brandId && Boolean(formik.errors.brandId)}>
                <InputLabel id="brand-label">Marca</InputLabel>
                <Select
                  labelId="brand-label"
                  id="brandId"
                  name="brandId"
                  value={formik.values.brandId}
                  label="Marca"
                  onChange={formik.handleChange}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.brandId && formik.errors.brandId && (
                  <Typography variant="caption" color="error">
                    {formik.errors.brandId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.modelId && Boolean(formik.errors.modelId)} disabled={!formik.values.brandId}>
                <InputLabel id="model-label">Modello</InputLabel>
                <Select
                  labelId="model-label"
                  id="modelId"
                  name="modelId"
                  value={formik.values.modelId}
                  label="Modello"
                  onChange={formik.handleChange}
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.modelId && formik.errors.modelId && (
                  <Typography variant="caption" color="error">
                    {formik.errors.modelId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="year"
                name="year"
                label="Anno"
                type="number"
                value={formik.values.year}
                onChange={formik.handleChange}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="mileage"
                name="mileage"
                label="Chilometraggio (km)"
                type="number"
                value={formik.values.mileage}
                onChange={formik.handleChange}
                error={formik.touched.mileage && Boolean(formik.errors.mileage)}
                helperText={formik.touched.mileage && formik.errors.mileage}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}>
                <InputLabel id="fuel-type-label">Carburante</InputLabel>
                <Select
                  labelId="fuel-type-label"
                  id="fuelType"
                  name="fuelType"
                  value={formik.values.fuelType}
                  label="Carburante"
                  onChange={formik.handleChange}
                >
                  {fuelTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.fuelType && formik.errors.fuelType && (
                  <Typography variant="caption" color="error">
                    {formik.errors.fuelType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={formik.touched.transmission && Boolean(formik.errors.transmission)}>
                <InputLabel id="transmission-label">Cambio</InputLabel>
                <Select
                  labelId="transmission-label"
                  id="transmission"
                  name="transmission"
                  value={formik.values.transmission}
                  label="Cambio"
                  onChange={formik.handleChange}
                >
                  {transmissionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.transmission && formik.errors.transmission && (
                  <Typography variant="caption" color="error">
                    {formik.errors.transmission}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="power"
                name="power"
                label="Potenza (CV)"
                type="number"
                value={formik.values.power}
                onChange={formik.handleChange}
                error={formik.touched.power && Boolean(formik.errors.power)}
                helperText={formik.touched.power && formik.errors.power}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="engineSize"
                name="engineSize"
                label="Cilindrata (cc)"
                type="number"
                value={formik.values.engineSize}
                onChange={formik.handleChange}
                error={formik.touched.engineSize && Boolean(formik.errors.engineSize)}
                helperText={formik.touched.engineSize && formik.errors.engineSize}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="color"
                name="color"
                label="Colore"
                value={formik.values.color}
                onChange={formik.handleChange}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            Immagini
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Funzionalità di caricamento immagini in fase di sviluppo. Verranno utilizzate immagini di esempio.
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Pubblica annuncio'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAdPage;
