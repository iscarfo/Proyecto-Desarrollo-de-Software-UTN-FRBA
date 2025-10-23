'use client';
import React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const Footer: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#E1E1E1',
        padding: 5,
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: 6, 
          flexWrap: 'wrap', 
          gap: 4 
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Tienda Sol
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Redes sociales
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'black',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#14213d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
              >
                <FiFacebook size={20} style={{ color: 'white' }} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'black',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#14213d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
              >
                <FaTiktok size={20} style={{ color: 'white' }} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'black',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#14213d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
              >
                <FiTwitter size={20} style={{ color: 'white' }} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'black',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#14213d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'black'}
              >
                <FiInstagram size={20} style={{ color: 'white' }} />
              </a>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: 2,
                letterSpacing: '0.1em',
              }}
            >
              SUBSCRIBITE
            </Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '280px', gap: '12px' }}>
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
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: 0,
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                Enviar
              </Button>
            </form>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            © 2025 tienda sol — Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
