import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAdById, updateAd, reset } from '../store/adsSlice';
import { Container, Typography, Box, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup.string().required('Titolo obbligatorio'),
  description: yup.string().required('Descrizione obbligatoria'),
  price: yup.number().required('Prezzo obbligatorio').min(0, 'Prezzo non valido'),
});

const EditAdPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ad, isLoading, isError, isSuccess, message } = useSelector((state) => state.ads);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getAdById(id));
    return () => dispatch(reset());
  }, [dispatch, id]);

  useEffect(() => {
    if (isSuccess && submitted) {
      navigate('/dashboard');
    }
  }, [isSuccess, submitted, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: ad?.title || '',
      description: ad?.description || '',
      price: ad?.price || '',
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmitted(true);
      dispatch(updateAd({ id, adData: values }));
    },
  });

  if (isLoading && !ad) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{message || 'Errore nel caricamento annuncio.'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Modifica Annuncio
        </Typography>
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
            minRows={4}
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
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Salva modifiche'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditAdPage;