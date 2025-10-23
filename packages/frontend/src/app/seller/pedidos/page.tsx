'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
// Importamos tu OrderRow y Pagination
import OrderRow, { Product, OrderStatus } from '@/components/OrderRow/OrderRow';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container } from '@mui/material';
import { useState } from 'react';

// Definimos un tipo para el pedido completo
type Order = {
  orderId: string;
  status: OrderStatus;
  deliveryAddress: string;
  products: Product[];
};

export default function AdminPedidosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Pedidos por página

  // --- Datos de ejemplo que coinciden con tu imagen ---
  const sampleAdminOrders: Order[] = [
    {
      orderId: "#00001",
      status: "Enviado",
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Remera blanca", imageUrl: "https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png", size: "L", quantity: 1 }
      ]
    },
    {
      orderId: "#00004",
      status: "Cancelado",
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Jean azul", imageUrl: "https://www.jamessmart.com/home/wp-content/uploads/ART-25629-JEAN-5B-AZUL.jpg", size: "44", quantity: 2 }
      ]
    },
    {
      orderId: "#00206",
      status: "Pendiente",
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Sweater cremita", imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png", size: "S", quantity: 1 }
      ]
    },
    {
      orderId: "#01789",
      status: "Confirmado",
      deliveryAddress: "Av. Monroe 3506",
      products: [
        { name: "Sweater cremita", imageUrl: "https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png", size: "S", quantity: 1 },
        { name: "Campera negra", imageUrl: "https://sportotalar.vtexassets.com/arquivos/ids/524650/1380871-001-21026-BLACK_1.png?v=638531908327530000", quantity: 2 },
        { name: "Jean azul", imageUrl: "https://www.jamessmart.com/home/wp-content/uploads/ART-25629-JEAN-5B-AZUL.jpg", size: "42", quantity: 1 }
      ]
    },
    // Agrega más pedidos aquí para probar la paginación
  ];

  const totalPages = Math.ceil(sampleAdminOrders.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = sampleAdminOrders.slice(startIndex, endIndex);

  // --- Handlers para las acciones del vendedor ---
  // En un caso real, esto actualizaría el estado o llamaría a una API
  const handleConfirmOrder = (orderId: string) => {
    console.log(`Confirmando pedido: ${orderId}`);
    alert(`Pedido ${orderId} confirmado`);
  };

  const handleCancelOrderSeller = (orderId: string) => {
    console.log(`Vendedor cancelando pedido: ${orderId}`);
    alert(`Pedido ${orderId} cancelado`);
  };

  const handleSendOrder = (orderId: string) => {
    console.log(`Enviando pedido: ${orderId}`);
    alert(`Pedido ${orderId} enviado`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="seller" />

      <main className="flex-grow py-12" style={{ backgroundColor: '#EDEDED' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ marginBottom: 4, fontWeight: 'bold' , color: 'primary.main'}}
          >
            Administrar pedidos
          </Typography>

          {paginatedOrders.map((order) => (
            <OrderRow
              key={order.orderId}
              orderId={order.orderId}
              status={order.status}
              deliveryAddress={order.deliveryAddress}
              products={order.products}
              userType="seller" // MUY IMPORTANTE: Le decimos al componente que es la vista de vendedor
              
              // Pasamos los handlers del vendedor
              onConfirm={handleConfirmOrder}
              onSend={handleSendOrder}
              onCancelSeller={handleCancelOrderSeller}

              // Pasamos dummies para las props de comprador que no usamos aquí
              onCancel={() => {}}
              onRepurchase={() => {}}
            />
          ))}

          <Box sx={{ marginTop: 4 }}>
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