import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
        </Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Pagina non trovata
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          La pagina che stai cercando non esiste o è stata spostata.
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button variant="contained" component={RouterLink} to="/">
              Torna alla home
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" component={RouterLink} to="/cars">
              Sfoglia annunci
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
