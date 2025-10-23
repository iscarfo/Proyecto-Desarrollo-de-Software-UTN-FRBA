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
  const pageSize = 4; // ahora mostramos 4 pedidos por página

  // Datos de ejemplo para OrderRow
  const sampleOrders = [
    {
      orderId: "#00001",
      status: "Enviado" as const,
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Remera blanca", imageUrl: "https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png", size: "L", quantity: 1 }
      ]
    },
    {
      orderId: "#00002",
      status: "Pendiente" as const,
      deliveryAddress: "Av. Rivadavia 9012",
      products: [
        { name: "Sweater cremita", imageUrl: "https://acdn-us.mitiendanube.com/stores/242/695/products/1000199931-285643ebaf86c68c2517148343802720-1024-1024.jpg", size: "S", quantity: 1 }
      ]
    },
    {
      orderId: "#00003",
      status: "Confirmado" as const,
      deliveryAddress: "Calle Falsa 123",
      products: [
        { name: "Pantalón negro", imageUrl: "https://juanperez.com.ar/cdn/shop/files/5488801.T38_284_29.jpg?v=1729261528", quantity: 2 }
      ]
    },
    {
      orderId: "#00004",
      status: "Cancelado" as const,
      deliveryAddress: "Av. Libertador 4500",
      products: [
        { name: "Camisa azul", imageUrl: "https://www.wessi.com/cdn/shop/files/4_59a965a0-1caf-4241-b0aa-e24ed8d5fc5f.jpg?v=1726733385&width=1080", size: "M", quantity: 1 }
      ]
    },
    {
      orderId: "#00005",
      status: "Pendiente" as const,
      deliveryAddress: "Calle Corrientes 2200",
      products: [
        { name: "Zapatillas rojas", imageUrl: "https://http2.mlstatic.com/D_693634-MLA83771250445_042025-O.jpg", size: "42", quantity: 1 }
      ]
    },
  ];

  const totalPages = Math.ceil(sampleOrders.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = sampleOrders.slice(startIndex, endIndex);

  const handleCancelOrder = (orderId: string) => {
    console.log(`Cancelando pedido: ${orderId}`);
    alert(`Pedido ${orderId} cancelado`);
  };

  const handleRepurchase = (orderId: string) => {
    console.log(`Volviendo a comprar: ${orderId}`);
    alert(`Volviendo a comprar pedido ${orderId}`);
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

          {/* Sección de pedidos con paginación */}
          <Box sx={{ marginBottom: 6 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Algunos de tus pedidos
            </Typography>

            {paginatedOrders.map((order) => (
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

            <Box sx={{ marginTop: 4 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Box>

          {/* Sección de beneficios */}
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