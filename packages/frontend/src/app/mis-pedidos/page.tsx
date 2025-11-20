'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import OrderRow from '@/components/OrderRow/OrderRow';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container } from '@mui/material';
import { useState } from 'react';

export default function MisPedidosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // pedidos por página

  // Simulamos varios pedidos para probar la paginación
  const sampleOrders = [
    {
      orderId: "#00001",
      status: "ENVIADO" as const,
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Remera blanca", imageUrl: "https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png", size: "L", quantity: 1 }
      ]
    },
    {
      orderId: "#00002",
      status: "PENDIENTE" as const,
      deliveryAddress: "Av. Rivadavia 9012",
      products: [
        { name: "Sweater cremita", imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png", size: "S", quantity: 1 }
      ]
    },
    {
      orderId: "#00003",
      status: "CONFIRMADO" as const,
      deliveryAddress: "Calle Falsa 123",
      products: [
        { name: "Pantalón negro", imageUrl: "https://juanperez.com.ar/cdn/shop/files/5488801.T38_284_29.jpg?v=1729261528", quantity: 2 }
      ]
    },
    {
      orderId: "#00004",
      status: "CANCELADO" as const,
      deliveryAddress: "Av. Libertador 4500",
      products: [
        { name: "Camisa azul", imageUrl: "https://www.wessi.com/cdn/shop/files/4_59a965a0-1caf-4241-b0aa-e24ed8d5fc5f.jpg?v=1726733385&width=1080", size: "M", quantity: 1 }
      ]
    },
    {
      orderId: "#00005",
      status: "PENDIENTE" as const,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        role="main"
        aria-label="Sección de pedidos"
        className="flex-grow py-12"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ marginBottom: 4, fontWeight: 'bold', color: 'primary.main' }}
          >
            Mis Pedidos
          </Typography>

          <Box role="region" aria-label="Listado de pedidos">
            {paginatedOrders.map((order) => (
              <OrderRow
                key={order.orderId}
                orderId={order.orderId}
                status={order.status}
                deliveryAddress={order.deliveryAddress}
                products={order.products}
                userType="buyer"
                onCancel={(id) => console.log("Cancelar pedido", id)}
                onRepurchase={(id) => console.log("Volver a comprar", id)}
              />
            ))}
          </Box>

          <Box sx={{ marginTop: 4 }} aria-label="Paginación de pedidos">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Container>
      </main>

      <Footer />
    </div>
  );
}