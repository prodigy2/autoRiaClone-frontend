import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button, Pagination, CircularProgress } from '@mui/material';
import { getAds } from '../store/adsSlice';

const CarListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ads, isLoading } = useSelector((state) => state.ads);

  const [page, setPage] = useState(1);
  const adsPerPage = 8;

  useEffect(() => {
    dispatch(getAds());
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewAd = (id) => {
    navigate(`/cars/${id}`);
  };

  // Calcola gli annunci da mostrare nella pagina corrente
  const indexOfLastAd = page * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = Array.isArray(ads) ? ads.slice(indexOfFirstAd, indexOfLastAd) : [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Tutte le auto in vendita
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Sfoglia l’elenco completo degli annunci disponibili
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {currentAds.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {currentAds.map((ad) => (
                  <Grid item key={ad?.id} xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="180"
                        image={ad?.images?.[0]?.url || '/placeholder_car.jpg'}
                        alt={ad?.model?.brand?.name || 'Auto'}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {ad?.model?.brand?.name || 'Marca sconosciuta'} {ad?.model?.name || ''}
                        </Typography>
                        <Typography color="text.secondary">
                          Anno: {ad?.year || 'N/A'}
                        </Typography>
                        <Typography color="text.secondary">
                          Prezzo: {ad?.price ? `${ad.price} €` : 'N/A'}
                        </Typography>
                        <Typography color="text.secondary">
                          Km: {ad?.mileage !== undefined ? ad.mileage : 'N/A'}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleViewAd(ad?.id)}>
                          Visualizza
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil((ads?.length || 0) / adsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1" align="center" sx={{ my: 4 }}>
              Nessun annuncio trovato.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default CarListPage;