import React, { useState } from 'react';
import OrderRow from '../components/OrderRow/OrderRow';
import Pagination from '../components/Pagination/Pagination';
import './OrdersPage.css';

// Datos de prueba con URLs de imágenes de stock (simulando las URLs del back-end)
const DUMMY_ORDERS = [
  // Pedido 1: Enviado (Remera)
  { id: '#00001', date: '18/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Enviado', 
    products: [
      { 
        name: 'Remera Blanca', size: 'L', quantity: 1, 
        imageUrl: 'https://sublitextil.com.ar/wp-content/uploads/2019/01/Remera-sublimar-hombre-.jpg' // Imagen de stock de una remera
      },
    ]
  },
  // Pedido 2: Cancelado (Jean - 2 unidades)
  { id: '#00004', date: '17/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Cancelado', 
    products: [
      { 
        name: 'Jean azul', size: '44', quantity: 2, 
        imageUrl: 'https://acdn-us.mitiendanube.com/stores/943/997/products/jean-azul-oscuro-c8257365bc9539b07617337672702497-1024-1024.jpg' // Imagen de stock de un jean
      },
    ]
  },
  // Pedido 3: Pendiente (Sweater - 1 unidad)
  { id: '#00206', date: '16/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Pendiente', 
    products: [
      { 
        name: 'Sweater cremita', size: 'S', quantity: 1, 
        imageUrl: 'https://acdn-us.mitiendanube.com/stores/005/671/332/products/b9c32da4-9d23-4407-896f-47952cd509f8-000aa6b26f78f2fa0f17489040462992-480-0.webp' // Imagen de stock de un sweater
      },
    ]
  },
  // Pedido 4: Confirmado (Múltiples productos)
  { id: '#01789', date: '15/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Confirmado', 
    products: [
      { 
        name: 'Sweater cremita', size: 'S', quantity: 1, 
        imageUrl: 'https://acdn-us.mitiendanube.com/stores/005/671/332/products/b9c32da4-9d23-4407-896f-47952cd509f8-000aa6b26f78f2fa0f17489040462992-480-0.webp' // Sweater
      },
      { 
        name: 'Campera negra', size: '', quantity: 2, 
        imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_675355-MLA82337334569_022025-O.webp' // Campera
      },
      { 
        name: 'Jean azul talle 42', size: '42', quantity: 1, 
        imageUrl: 'https://acdn-us.mitiendanube.com/stores/943/997/products/jean-azul-oscuro-c8257365bc9539b07617337672702497-1024-1024.jpg' // Jean
      },
    ]
  },
  // Más pedidos para la paginación...
  { id: '#01788', date: '14/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Enviado', 
    products: [
      { name: 'Zapatillas', size: '40', quantity: 1, imageUrl: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/0c49e2e2b1774c1c820faf540092425a_9366/Zapatillas_Runfalcon_3.0_Negro_HP7556_01_standard.jpg' },
    ]
  },
  { id: '#01787', date: '13/09/2025', deliveryAddress: 'Av. Monroe 3506', status: 'Cancelado', 
    products: [
      { name: 'Remera', size: 'S', quantity: 1, imageUrl: 'https://acdn-us.mitiendanube.com/stores/943/997/products/jean-azul-oscuro-c8257365bc9539b07617337672702497-1024-1024.jpg' },
    ]
  },
];

const OrdersPage = ({ userType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const totalPages = Math.ceil(DUMMY_ORDERS.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = DUMMY_ORDERS.slice(indexOfFirstItem, indexOfLastItem);

  // NOTA: Para simular el comportamiento de window.confirm/alert en un entorno real,
  // si tu entorno no los permite, reemplaza por modales personalizados.
  const handleCancel = (orderId) => {
    if (window.confirm(`¿Estás seguro de cancelar el pedido ${orderId}?`)) {
        console.log(`Pedido ${orderId} cancelado (simulado).`);
    }
  };
  
  const handleRepurchase = (orderId) => {
    console.log(`Volver a comprar productos del pedido ${orderId} (simulado).`);
  };

  const title = 'Mis Pedidos';

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 20px' }}>
      <h1>{title}</h1>
      <div className="orders-list" style={{ marginTop: '30px' }}>
        {currentItems.map(order => (
          <OrderRow
            key={order.id}
            orderId={order.id}
            status={order.status}
            deliveryAddress={order.deliveryAddress}
            products={order.products}
            userType={userType}
            onCancel={handleCancel}
            onRepurchase={handleRepurchase}
          />
        ))}
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default OrdersPage;