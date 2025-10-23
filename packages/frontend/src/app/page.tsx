'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import OrderRow from '@/components/OrderRow/OrderRow';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container, Button } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Datos de ejemplo para OrderRow
  const sampleOrders = [
    {
      orderId: "#00001",
      status: "Enviado" as const,
      deliveryAddress: "Av. Monroe 3506",
      products: [
        {
          name: "Remera blanca",
          imageUrl: "https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png",
          size: "L",
          quantity: 1
        }
      ]
    },
    {
      orderId: "#00004",
      status: "Cancelado" as const,
      deliveryAddress: "Av. Santa Fe 5678",
      products: [
        {
          name: "Jean azul",
          imageUrl: "https://plataforma.iduo.com.ar/Panelcontenidos/Contenidos/Jean-rica-lewis-american-celeste-clasico-1718307204-0-1.png",
          size: "44",
          quantity: 2
        }
      ]
    },
    {
      orderId: "#00206",
      status: "Pendiente" as const,
      deliveryAddress: "Av. Rivadavia 9012",
      products: [
        {
          name: "Sweater cremita",
          imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png",
          size: "S",
          quantity: 1
        }
      ]
    },
    {
      orderId: "#01789",
      status: "Confirmado" as const,
      deliveryAddress: "Av. Corrientes 1234",
      products: [
        {
          name: "Sweater cremita",
          imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png",
          size: "S",
          quantity: 1
        },
        {
          name: "Campera negra",
          imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png/v1/fill/w_480,h_480,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png",
          size: "M",
          quantity: 2
        },
        {
          name: "Jean azul",
          imageUrl: "https://plataforma.iduo.com.ar/Panelcontenidos/Contenidos/Jean-rica-lewis-american-celeste-clasico-1718307204-0-1.png",
          size: "42",
          quantity: 1
        }
      ]
    }
  ];

  const handleCancelOrder = (orderId: string) => {
    console.log(`Cancelando pedido: ${orderId}`);
    alert(`Pedido ${orderId} cancelado`);
  };

  const handleRepurchase = (orderId: string) => {
    console.log(`Volviendo a comprar: ${orderId}`);
    alert(`Volviendo a comprar pedido ${orderId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`Cambiando a página: ${page}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" />

      <main className="flex-grow py-12" style={{ backgroundColor: '#EDEDED' }}>
        <Container maxWidth="lg">
          <Box className="text-center mb-8">
            <Typography variant="h2" component="h1" className="mb-4 font-bold text-oxford-blue">
              Bienvenido a Tienda Sol
            </Typography>
            <Typography variant="h5" className="text-oxford-blue mb-4">
              Tu tienda online de confianza
            </Typography>
            <Link href="/seller" passHref>
              <Button variant="contained" color="secondary" className="mt-4">
                Ver Panel de Vendedor
              </Button>
            </Link>
          </Box>

          {/* Sección de ejemplo con OrderRow */}
          <Box sx={{ marginBottom: 6 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Ejemplo de Pedidos
            </Typography>
            
            {sampleOrders.map((order) => (
              <OrderRow
                key={order.orderId}
                orderId={order.orderId}
                status={order.status}
                deliveryAddress={order.deliveryAddress}
                products={order.products}
                onCancel={handleCancelOrder}
                onRepurchase={handleRepurchase}
                userType="buyer"
              />
            ))}
          </Box>

          {/* Sección de ejemplo con Pagination */}
          <Box sx={{ marginBottom: 6 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                Productos de Calidad
              </Typography>
              <Typography variant="body1" className="text-black">
                Encuentra los mejores productos al mejor precio
              </Typography>
            </Box>

            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-orange font-bold">
                Envío Rápido
              </Typography>
              <Typography variant="body1" className="text-black">
                Recibe tus pedidos en tiempo récord
              </Typography>
            </Box>

            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                Soporte 24/7
              </Typography>
              <Typography variant="body1" className="text-black">
                Estamos aquí para ayudarte siempre
              </Typography>
            </Box>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
