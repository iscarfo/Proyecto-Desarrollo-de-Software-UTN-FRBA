'use client';
import React, { useState } from 'react';
import { Box, Button, Container, Typography, Divider, IconButton } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useRouter } from 'next/navigation';
import { Add, Remove } from '@mui/icons-material';

interface Product {
  _id: string;
  vendedor: string;
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: string;
  stock: number;
  totalVendido: number;
  fotos: string[];
}

interface Order {
  product: Product;
  quantity: number;
}

export default function CarritoPage() {
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState('Calle Falsa 123, CABA');
  const [orders, setOrders] = useState<Order[]>([
    {
      product: {
        _id: '1',
        vendedor: 'TiendaSol',
        titulo: 'Remera Blanca Talle L',
        descripcion: 'Algodón premium',
        precio: 25000,
        moneda: 'ARS',
        stock: 50,
        totalVendido: 10,
        fotos: ['https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png'],
      },
      quantity: 2,
    },
    {
      product: {
        _id: '3',
        vendedor: 'Regalos S.A.',
        titulo: 'Sweater Cremita Talle S',
        descripcion: 'Suave y abrigado',
        precio: 65000,
        moneda: 'ARS',
        stock: 50,
        totalVendido: 8,
        fotos: ['https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png'],
      },
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.product._id === productId
          ? {
              ...order,
              quantity: Math.max(1, Math.min(order.product.stock, order.quantity + delta)),
            }
          : order
      )
    );
  };

  const handleRemove = (productId: string) => {
    setOrders((prev) => prev.filter((order) => order.product._id !== productId));
  };

  const totalProductos = orders.reduce((acc, o) => acc + o.quantity, 0);
  const subtotal = orders.reduce((acc, o) => acc + o.product.precio * o.quantity, 0);
  const envio = 15000;
  const total = subtotal + envio;

  const handleComprar = () => {
    console.log('Pedido creado:', { deliveryAddress, orders });
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" />

      <main className="flex-grow py-12" style={{ backgroundColor: '#EDEDED' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: 24, sm: 32 } }}>
            Mi carrito
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, fontSize: { xs: 14, sm: 16 } }}>
            Dirección de entrega: <strong>{deliveryAddress}</strong>
          </Typography>

          {orders.map(({ product, quantity }) => (
            <Box
              key={product._id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 2,
                mb: 2,
                boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src={product.fotos[0]} alt={product.titulo} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{product.titulo}</Typography>
                  <Typography variant="body2">{product.descripcion}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Precio unitario: ARS ${product.precio.toLocaleString()}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  minWidth: 180,
                  visibility: 'visible', // ← fuerza visibilidad
                  opacity: 1,            // ← asegura que no esté oculto
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(product._id, -1)}
                    aria-label="Disminuir cantidad"
                    size="small"
                    sx={{ color: 'text.primary' }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(product._id, 1)}
                    aria-label="Aumentar cantidad"
                    size="small"
                    sx={{ color: 'text.primary' }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Button
                  color="error"
                  size="small"
                  onClick={() => handleRemove(product._id)}
                  sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
                >
                  Eliminar
                </Button>
              </Box>

            </Box>
          ))}

          {/* Totales */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Productos ({totalProductos})</Typography>
              <Typography>ARS ${subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Envío</Typography>
              <Typography>ARS ${envio.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                TOTAL
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ARS ${total.toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff9800",
                fontWeight: 600,
                fontSize: { xs: 16, sm: 20 },
                ":hover": { backgroundColor: "#e68900" },
              }}
              fullWidth
              onClick={handleComprar}
            >
              Comprar
            </Button>
          </Box>
        </Container>
      </main>

      <Footer />
    </div>
  );
}