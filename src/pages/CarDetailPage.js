import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdById, reset } from '../store/adsSlice';
import {
  Container, Typography, Box, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Paper
} from '@mui/material';

const CarDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ad, isLoading, isError, message } = useSelector((state) => state.ads);

  useEffect(() => {
    dispatch(getAdById(id));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !ad) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Errore
          </Typography>
          <Typography variant="body1">
            {message || 'Annuncio non trovato.'}
          </Typography>
          <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate('/')}>
            Torna alla home
          </Button>
        </Paper>
      </Container>
    );
  }

  // Funzione per ottenere l'URL dell'immagine principale
  const getImageUrl = () => {
    if (ad?.images && ad.images.length > 0) {
      return ad.images[0].url;
    }
    return 'https://placehold.co/600x400?text=Nessuna+immagine';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Card>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="400"
              image={getImageUrl()}
              alt={`${ad.model?.brand?.name || 'Marca sconosciuta'} ${ad.model?.name || 'Modello sconosciuto'}`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {ad.model?.brand?.name || 'Marca sconosciuta'} {ad.model?.name || 'Modello sconosciuto'}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {ad.year ? `Anno: ${ad.year}` : 'Anno non disponibile'}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {ad.price ? `${ad.price} €` : 'Prezzo non disponibile'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {ad.description || 'Nessuna descrizione disponibile.'}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Dettagli venditore
                </Typography>
                <Typography variant="body2">
                  {ad.seller?.firstName} {ad.seller?.lastName}
                </Typography>
                <Typography variant="body2">
                  Email: {ad.seller?.email || 'Non disponibile'}
                </Typography>
              </Box>
              <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate('/cars')}>
                Torna agli annunci
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default CarDetailPage;