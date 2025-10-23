'use client';
import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const Footer: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de suscripción
  };

  return (
    <Box
      component="footer"
      className="bg-platinum py-10 px-5 w-full"
    >
      <Container maxWidth="lg">
        {/* Contenido superior */}
        <div className="flex justify-between items-start mb-12 flex-wrap gap-16">

          {/* Sección de Logo y Redes Sociales (Izquierda) */}
          <Box className="flex flex-col items-start">
            <Typography variant="h4" className="font-bold mb-5">
              Tienda Sol
            </Typography>
            <Typography variant="body1" className="mb-4 font-normal">
              Redes sociales
            </Typography>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-oxford-blue transition-colors"
              >
                <FiFacebook size={20} className="text-white" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-oxford-blue transition-colors"
              >
                <FaTiktok size={20} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-oxford-blue transition-colors"
              >
                <FiTwitter size={20} className="text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded flex items-center justify-center hover:bg-oxford-blue transition-colors"
              >
                <FiInstagram size={20} className="text-white" />
              </a>
            </div>
          </Box>

          {/* Sección de Suscripción (Derecha) */}
          <Box className="flex flex-col items-start">
            <Typography
              variant="body1"
              className="font-black text-lg mb-4 tracking-wider"
            >
              SUBSCRIBITE
            </Typography>
            <form onSubmit={handleSubmit} className="flex flex-col w-[280px] gap-3">
              <TextField
                type="email"
                placeholder="Ingresa tu mail"
                size="small"
                fullWidth
                required
                aria-label="Ingresa tu mail para suscribirte"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: 0,
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#14213d',
                  },
                }}
              >
                Enviar
              </Button>
            </form>
          </Box>
        </div>

        {/* Franja de Copyright */}
        <Box className="text-center mt-8">
          <Typography variant="body2" className="text-sm">
            © 2025 tienda sol — Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
