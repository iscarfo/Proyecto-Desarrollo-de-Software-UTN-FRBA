'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import OrderRow, { Product, OrderStatus } from '@/components/OrderRow/OrderRow';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from "axios";

// Definimos un tipo para el pedido completo
type Order = {
  orderId: string;
  status: OrderStatus;
  deliveryAddress: string;
  products: Product[];
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Pedidos por página

  // 🔹 Traer pedidos reales al montar el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/pedidos");
        // Adaptamos la respuesta del backend al tipo Order esperado en el front
        const mappedOrders: Order[] = res.data.map((p: any) => ({
          orderId: p.id,
          status: p.estado,
          deliveryAddress: p.deliveryAddress,
          products: p.products // ya viene con name, imageUrl, quantity
        }));
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Error al traer pedidos:", err.message);
      }
    };
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / pageSize);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // --- Handlers para las acciones del vendedor ---
  const handleConfirmOrder = (orderId: string) => {
    console.log(`Confirmando pedido: ${orderId}`);
    alert(`Pedido ${orderId} confirmado`);
  };

  const handleCancelOrderSeller = async (orderId: string) => {
    try {
      const compradorId = "68ea5e9ea0dd042efc615598"; // simulado
      await axios.delete(`http://localhost:3000/pedidos/${orderId}`, {
        data: { compradorId },
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "CANCELADO" } : o
        )
      );

      alert(`Pedido ${orderId} CANCELADO`);
    } catch (err: any) {
      alert(`Error al cancelar pedido: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleSendOrder = async (orderId: string, vendedorId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${orderId}/enviado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendedorId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al marcar pedido como enviado");
      }

      const data = await response.json();
      alert(`Pedido ${data.pedido} marcado como ${data.estado}`);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "ENVIADO" } : o
        )
      );
    } catch (err: any) {
      alert(`Error al enviar pedido: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="seller" />

      <main
        role="main"
        aria-label="Sección de administración de pedidos"
        className="flex-grow py-12"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ marginBottom: 4, fontWeight: 'bold', color: 'primary.main' }}
          >
            Administrar pedidos
          </Typography>

          <Box role="region" aria-label="Listado de pedidos del vendedor">
            {paginatedOrders.map((order) => (
              <OrderRow
                key={order.orderId}
                orderId={order.orderId}
                status={order.status}
                deliveryAddress={order.deliveryAddress}
                products={order.products}
                userType="seller"
                onConfirm={handleConfirmOrder}
                // TODO: pasar el vendedorId real cuando tengamos sesiones
                onSend={(orderId) => handleSendOrder(orderId, "68d82ab654219bb082182057")} 
                onCancelSeller={handleCancelOrderSeller}
                onCancel={() => {}}
                onRepurchase={() => {}}
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