import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Tabs, Tab, Divider } from '@mui/material';
import { getAds, deleteAd } from '../store/adsSlice';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper per la label del tipo account (gestione user.roles array di stringhe)
const getAccountTypeLabel = (user) => {
  if (!user || !user.accountType) return 'Base';
  const accountType = String(user.accountType).toLowerCase();

  // Recupera il primo ruolo se esiste
  let roleName = '';
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    roleName = String(user.roles[0]).toLowerCase();
  }

  if (accountType === 'premium') return 'Premium';
  if (accountType === 'internal') {
    if (roleName === 'admin') return 'Amministratore';
    if (roleName === 'manager') return 'Manager';
    return 'Internal';
  }
  return 'Base';
};

// Helper per l'immagine principale dell'annuncio
const getAdImageUrl = (ad) => {
  if (ad?.images && ad.images.length > 0) {
    const img = ad.images[0];
    if (typeof img === 'string') return img;
    if (img && img.url) return img.url;
  }
  return 'https://placehold.co/300x160?text=Nessuna+immagine';
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { ads, isLoading } = useSelector((state) => state.ads);
  const [tabValue, setTabValue] = useState(0);
  const [userAds, setUserAds] = useState([]);

  useEffect(() => {
    dispatch(getAds());
  }, [dispatch]);

  useEffect(() => {
    if (ads && user) {
      const filteredAds = ads.filter(ad => ad.seller.id === user.user.id);
      setUserAds(filteredAds);
    }
  }, [ads, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateAd = () => {
    navigate('/create-ad');
  };

  const handleEditAd = (id) => {
    navigate(`/edit-ad/${id}`);
  };

  const handleDeleteAd = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      dispatch(deleteAd(id));
    }
  };

  const handleViewAd = (id) => {
    navigate(`/cars/${id}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateAd}
        >
          Crea nuovo annuncio
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Benvenuto, {user?.user?.firstName || 'Utente'} {user?.user?.lastName || ''}
          </Typography>
          <Typography variant="body1">
            Tipo account: <strong>{getAccountTypeLabel(user?.user)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.user.accountType === 'premium'
              ? 'Puoi pubblicare un numero illimitato di annunci e accedere a tutte le funzionalità premium.'
              : 'Con un account base puoi pubblicare fino a 1 annuncio. Passa a Premium per sbloccare funzionalità aggiuntive.'}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="I miei annunci" />
            <Tab label="Preferiti" />
            <Tab label="Messaggi" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {userAds.length > 0 ? (
            <Grid container spacing={3}>
              {userAds.map((ad) => (
                <Grid item key={ad.id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={getAdImageUrl(ad)}
                      alt={`${ad.car?.brand?.name || ''} ${ad.car?.model?.name || ''}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {ad.car?.brand?.name} {ad.car?.model?.name}
                      </Typography>
                      <Typography variant="body1" color="text.primary" fontWeight="bold">
                        € {ad.price?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Anno: {ad.car?.year} • {ad.car?.mileage?.toLocaleString()} km
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Visualizzazioni: {ad.views}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewAd(ad.id)}
                      >
                        Visualizza
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditAd(ad.id)}
                      >
                        Modifica
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        Elimina
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Non hai ancora pubblicato annunci
              </Typography>
              <Typography variant="body1" paragraph>
                Crea il tuo primo annuncio per iniziare a vendere la tua auto.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateAd}
              >
                Crea nuovo annuncio
              </Button>
            </Box>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Nessun annuncio preferito
            </Typography>
            <Typography variant="body1">
              Aggiungi annunci ai preferiti per visualizzarli qui.
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Nessun messaggio
            </Typography>
            <Typography variant="body1">
              I messaggi ricevuti dai potenziali acquirenti appariranno qui.
            </Typography>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default DashboardPage;