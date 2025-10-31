'use client';
import React, { useState } from 'react';
import { Box, Button, Container, Typography, Divider } from '@mui/material';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import CartItem, { Product } from '@/components/Minicart/CartItem';
import Pagination from '@/components/Pagination/Pagination';

interface Order {
  orderId: string;
  status: 'Disponible' | 'Agotado';
  deliveryAddress: string;
  products: Product[];
  quantity: number;
  available: boolean;
}

export default function CarritoPage() {
  // Simulación de pedidos
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: '00001',
      status: 'Disponible',
      deliveryAddress: 'Calle Falsa 123, CABA',
      products: [
        {
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
      ],
      quantity: 2,
      available: true,
    },
    {
      orderId: '00004',
      status: 'Agotado',
      deliveryAddress: 'Av. Siempre Viva 456, CABA',
      products: [
        {
          _id: '2',
          vendedor: 'Tienda Rosa',
          titulo: 'Jean Azul Talle 44',
          descripcion: 'Clásico',
          precio: 65000,
          moneda: 'ARS',
          stock: 0,
          totalVendido: 5,
          fotos: ['https://i.postimg.cc/4dBtbbTd/bolso.jpg'],
        },
      ],
      quantity: 0,
      available: false,
    },
    {
      orderId: '02104',
      status: 'Disponible',
      deliveryAddress: 'Calle Verde 789, CABA',
      products: [
        {
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
      ],
      quantity: 2,
      available: true,
    },
  ]);

  // Calcular totales
  const totalProductos = orders.reduce((acc, order) => acc + order.quantity, 0);
  const subtotal = orders.reduce(
    (acc, order) => acc + order.products.reduce((pAcc, p) => pAcc + p.precio * order.quantity, 0),
    0
  );
  const envio = 15000;
  const total = subtotal + envio;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" />

      <main className="flex-grow py-12" style={{ backgroundColor: '#EDEDED' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
            Mi carrito
          </Typography>

          {/* Lista de pedidos */}
          {orders.map((order) => (
            <CartItem
              key={order.orderId}
              orderId={order.orderId}
              status={order.status}
              deliveryAddress={order.deliveryAddress}
              products={order.products}
              quantity={order.quantity}
              available={order.available}
              onRemove={() => setOrders(orders.filter((o) => o.orderId !== order.orderId))}
            />
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
              <Typography>$ {subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Envío</Typography>
              <Typography>$ {envio.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                TOTAL
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ARS $ {total.toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff9800",
                fontWeight: 600,
                fontSize: 20,
                ":hover": { backgroundColor: "#e68900" },
              }}
              fullWidth
              onClick={() => console.log('Crear Pedido')}
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
