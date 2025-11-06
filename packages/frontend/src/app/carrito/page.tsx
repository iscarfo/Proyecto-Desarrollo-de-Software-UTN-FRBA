'use client';

import React from 'react';
import { Box, Button, Container, Typography, Divider, IconButton } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../../store/CartContext';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = cart.find((p) => p._id === productId);
    if (!item) return;
    const newQty = Math.max(1, Math.min(item.stock, item.cantidad + delta));
    updateQuantity(productId, newQty);
  };

  const totalProductos = cart.reduce((acc, p) => acc + p.cantidad, 0);
  const subtotal = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const envio = cart.length > 0 ? 15000 : 0;
  const total = subtotal + envio;

  const formatCurrency = (moneda: string) => {
    switch (moneda) {
      case "PESO_ARG":
        return "ARS";
      case "DOLAR_USA":
        return "USD";
      case "REAL":
        return "BRL";
      default:
        return "";
    }
  };

  const handleComprar = () => {
    if (cart.length === 0) return;
    clearCart();
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" />

      <main className="flex-grow py-12" style={{ backgroundColor: '#EDEDED' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: 24, sm: 32 } }}
          >
            Mi carrito
          </Typography>

          {cart.length === 0 ? (
            <Typography variant="body1">Tu carrito está vacío.</Typography>
          ) : (
            <>
              {cart.map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={product.fotos?.[0] || '/placeholder.jpg'}
                    alt={product.titulo}
                    sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{product.titulo}</Typography>
                    <Typography sx={{ color: '#555', fontSize: 14 }}>
                      {product.descripcion}
                    </Typography>

                    <Typography sx={{ mt: 1, fontWeight: 500 }}>
                      ${product.precio.toLocaleString('es-AR')} {formatCurrency(product.moneda)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => handleQuantityChange(product._id, -1)} sx={{ color: "#333" }}>
                      <Remove />
                    </IconButton>

                    <Typography>{product.cantidad}</Typography>

                    <IconButton onClick={() => handleQuantityChange(product._id, 1)} sx={{ color: "#333" }}>
                      <Add />
                    </IconButton>
                  </Box>

                  <Typography sx={{ width: 120, textAlign: 'right', fontWeight: 600 }}>
                    ${(product.precio * product.cantidad).toLocaleString('es-AR')}{" "}
                    {formatCurrency(product.moneda)}
                  </Typography>

                  <IconButton onClick={() => removeFromCart(product._id)} sx={{ color: "#d32f2f" }}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                <Box sx={{ minWidth: 300 }}>
                  <Typography sx={{ mb: 1 }}>
                    Subtotal ({totalProductos} productos): ${subtotal.toLocaleString('es-AR')}
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    Envío: ${envio.toLocaleString('es-AR')}
                  </Typography>

                  <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 1 }}>
                    Total: ${total.toLocaleString('es-AR')}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleComprar}
                  >
                    Comprar
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}