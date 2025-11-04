'use client';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Botones superiores */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 24,
          display: 'flex',
          gap: 2
        }}
      >
        <Link href="/registro" passHref>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
            Crear Cuenta
          </Button>
        </Link>
        <Link href="/inicio-sesion" passHref>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
            Iniciar Sesión
          </Button>
        </Link>
      </Box>

      {/* Sección izquierda */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'orange', mb: 2, fontFamily: 'var(--font-montserrat)' }}>
          Descubre y encuentra tu estilo
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '480px', mb: 4 }}>
          Explorá los productos que ofrecen distintos emprendedores, descubrí nuevas marcas y
          encontrá exactamente lo que buscás.
        </Typography>
        <Link href="/home" passHref>
          <Button variant="outlined" sx={{ backgroundColor: 'white', color: 'black' }}>
            Descubrir Ahora
          </Button>
        </Link>
      </Box>

      {/* Sección derecha */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'url("/img/modelo_home.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: '10px',
          marginRight: '15%',
        }}
      />
    </Box>
  );
};

export default LandingPage;
