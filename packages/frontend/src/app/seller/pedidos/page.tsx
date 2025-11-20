'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import OrderRow, { Product, OrderStatus } from '@/components/OrderRow/OrderRow';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from "axios";
import { withRole } from '@/src/hocs';
import { useAuth } from '@clerk/nextjs';

type Order = {
  orderId: string;
  status: OrderStatus;
  deliveryAddress: string;
  products: Product[];
};

function AdminPedidosPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Pedidos por página

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pedidos`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const mappedOrders: Order[] = res.data.map((p: any) => ({
          orderId: p.id,
          status: p.estado,
          deliveryAddress: p.deliveryAddress,
          products: p.products
        }));
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Error al traer pedidos:", err.message);
      }
    };
    fetchOrders();
  }, [getToken]);

  const totalPages = Math.ceil(orders.length / pageSize);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // --- Handlers para las acciones del vendedor ---
  const handleConfirmOrder = async (orderId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/${orderId}/confirmar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al confirmar pedido");
      }

      const data = await response.json();
      alert(`Pedido ${data.pedido} marcado como ${data.estado}`);

      // 🔹 Actualizar estado local sin recargar
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "CONFIRMADO" } : o
        )
      );
    } catch (err: any) {
      alert(`Error al confirmar pedido: ${err.message}`);
    }
  };

  const handleCancelOrderSeller = async (orderId: string) => {
    try {
      const token = await getToken();
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
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

  const handleSendOrder = async (orderId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos/${orderId}/enviado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
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
      <Navbar />

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
                onSend={handleSendOrder}
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

export default withRole('vendedor')(AdminPedidosPage);