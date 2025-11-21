'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import {
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';
import { withRole } from '@/src/hocs';

// Importa tus componentes existentes
import MisProductosView from '@/components/SellerViews/MisProductosView';
import AdministrarPedidosView from '@/components/SellerViews/AdministrarPedidosView';

function SellerDashboardPage() {
  const [selectedView, setSelectedView] = useState<'orders' | 'products'>('orders');

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'orders' | 'products' | null
  ) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Navbar />

      <main role="main" aria-label="Panel de vendedor" className="flex-grow py-12">
        <Container maxWidth="lg">
          {/* Header con título y selector */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Panel de Vendedor
            </Typography>

            {/* Toggle Button Group como Slider */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                value={selectedView}
                exclusive
                onChange={handleViewChange}
                aria-label="selector de vista"
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 2,
                  '& .MuiToggleButton-root': {
                    px: 4,
                    py: 1.5,
                    border: 'none',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    gap: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    },
                    '&:not(.Mui-selected)': {
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="orders" aria-label="administrar pedidos">
                  <FiShoppingCart size={20} />
                  Administrar Pedidos
                </ToggleButton>
                <ToggleButton value="products" aria-label="mis productos">
                  <FiPackage size={20} />
                  Mis Productos
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Renderizado condicional de componentes */}
          {selectedView === 'orders' ? (
            <AdministrarPedidosView />
          ) : (
            <MisProductosView />
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default withRole('vendedor')(SellerDashboardPage);