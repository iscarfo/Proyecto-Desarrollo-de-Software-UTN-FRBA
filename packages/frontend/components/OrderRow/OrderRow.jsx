import React from 'react';
import './OrderRow.css';

/**
 * Componente que representa una fila completa de un pedido (Vista Comprador - Diseño Final).
 * Esta versión se adhiere estrictamente al mock-up final (Botones apilados, Info central, Múltiples productos).
 *
 * @param {object} props
 * @param {string} props.orderId - ID del pedido (ej: #00001)
 * @param {string} props.status - Estado actual del pedido (ej: Enviado, Cancelado, Pendiente, Confirmado)
 * @param {string} props.deliveryAddress - Dirección de entrega (ej: Av. Monroe 3506)
 * @param {array} props.products - Lista de productos en el pedido.
 * @param {function} props.onCancel - Función para cancelar el pedido.
 * @param {function} props.onRepurchase - Función para volver a comprar.
 */
const OrderRow = ({
  orderId,
  status,
  deliveryAddress,
  products,
  onCancel,
  onRepurchase,
  userType // Mantenemos por si se usa para la vista Vendedor después
}) => {

  // Determina la clase CSS para el color del estado
  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case 'Enviado':
        return 'status-shipped-v3';
      case 'Cancelado':
        return 'status-cancelled-v3';
      case 'Pendiente':
        return 'status-pending-v3';
      case 'Confirmado':
        return 'status-confirmed-v3';
      default:
        return 'status-default-v3';
    }
  };

  const statusClass = getStatusClass(status);
  
  // El botón de cancelar está DESHABILITADO si el pedido ya está Enviado o Cancelado.
  const isCancelDisabled = ['Enviado', 'Cancelado'].includes(status);

  return (
    <div className="order-row-v3">
      <div className="order-products-container">
        
        {/* ENCABEZADO (Estado, ID y Dirección) - Va encima del listado de productos */}
        <div className="order-meta-header-v3">
          <span className={`status-tag-v3 ${statusClass}`}>{status}</span>
          <span className="order-meta-info-v3">
            Pedido nro: {orderId} • {deliveryAddress}
          </span>
        </div>
        
        {/* LISTA DE PRODUCTOS DENTRO DEL PEDIDO */}
        {products.map((product, index) => (
          <div key={index} className="order-product-item-v3">
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/70x70?text=Prod'} 
              alt={product.name} 
              className="product-thumbnail-v3" 
            />
            <div className="product-text-details-v3">
              <p className="product-name-v3">{product.name} {product.size && `talle ${product.size}`}</p>
              <p className="product-quantity-v3">{product.quantity} unidad{product.quantity > 1 ? 'es' : ''}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTONES DE ACCIÓN (Derecha, apilados) */}
      <div className="order-actions-right-v3">
        {/* Botón 1: Cancelar Pedido (Deshabilitado si corresponde) */}
        <button 
            className="action-button-v3 cancel-button-v3"
            onClick={() => !isCancelDisabled && onCancel(orderId)}
            disabled={isCancelDisabled}
        >
            Cancelar Pedido
        </button>
        
        {/* Botón 2: Volver a Comprar (Siempre Habilitado) */}
        <button 
            className="action-button-v3 repurchase-button-v3"
            onClick={() => onRepurchase(orderId)}
        >
            Volver a Comprar
        </button>
      </div>
    </div>
  );
};

export default OrderRow;