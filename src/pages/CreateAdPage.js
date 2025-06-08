import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, TextField, Button, MenuItem, Paper, Alert, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createAd, reset, getBrands } from '../store/adsSlice';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  title: yup.string().required('Titolo obbligatorio'),
  description: yup.string().required('Descrizione obbligatoria'),
  price: yup.number().required('Prezzo obbligatorio').min(0, 'Prezzo non valido'),
  modelId: yup.string().required('ID del modello è obbligatorio'),
  year: yup.number().required('Anno è obbligatorio').max(new Date().getFullYear(), 'Anno non può essere nel futuro'),
  mileage: yup.number().required('Chilometraggio è obbligatorio').min(0, 'Il chilometraggio non può essere negativo'),
  currency: yup.string().required('Valuta è obbligatoria').oneOf(['EUR', 'USD'], 'Valuta non valida'),
});

const CreateAdPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, isLoading, isError, isSuccess, message } = useSelector((state) => state.ads);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [models, setModels] = useState([]);
  const [showError, setShowError] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      brand: '',
      modelId: '',
      year: '',
      mileage: '',
      currency: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createAd({
        title: values.title,
        description: values.description,
        price: values.price,
        modelId: values.modelId,
        year: values.year,
        mileage: values.mileage,
        currency: values.currency,
      }));
    },
  });

  useEffect(() => {
    dispatch(getBrands());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedBrand) {
      const brandObj = brands.find((b) => b.id === selectedBrand);
      setModels(brandObj?.models || []);
    } else {
      setModels([]);
    }
  }, [selectedBrand, brands]);

  useEffect(() => {
    if (isError) setShowError(true);
    if (isSuccess) {
      formik.resetForm();
      navigate('/dashboard');
    }
  }, [isError, isSuccess, formik, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crea un nuovo annuncio
        </Typography>
        {showError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShowError(false)}>
            {message || 'Errore durante la creazione. Riprova.'}
          </Alert>
        )}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Titolo"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Descrizione"
            name="description"
            multiline
            minRows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Prezzo"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Marca"
            name="brand"
            value={formik.values.brand}
            onChange={(e) => {
              formik.setFieldValue('brand', e.target.value);
              setSelectedBrand(e.target.value);
              formik.setFieldValue('modelId', '');
            }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Seleziona marca</MenuItem>
            {brands && brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Modello"
            name="modelId"
            value={formik.values.modelId}
            onChange={formik.handleChange}
            error={formik.touched.modelId && Boolean(formik.errors.modelId)}
            helperText={formik.touched.modelId && formik.errors.modelId}
            sx={{ mb: 2 }}
            disabled={!formik.values.brand}
          >
            <MenuItem value="">Seleziona modello</MenuItem>
            {models.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Anno"
            name="year"
            type="number"
            value={formik.values.year}
            onChange={formik.handleChange}
            error={formik.touched.year && Boolean(formik.errors.year)}
            helperText={formik.touched.year && formik.errors.year}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Chilometraggio"
            name="mileage"
            type="number"
            value={formik.values.mileage}
            onChange={formik.handleChange}
            error={formik.touched.mileage && Boolean(formik.errors.mileage)}
            helperText={formik.touched.mileage && formik.errors.mileage}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Valuta"
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={formik.touched.currency && formik.errors.currency}
            sx={{ mb: 2 }}
          >
            <MenuItem value="EUR">Euro</MenuItem>
            <MenuItem value="USD">Dollaro</MenuItem>
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Crea annuncio'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAdPage;