'use client';
import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';

export type OrderStatus = 'Enviado' | 'Cancelado' | 'Pendiente' | 'Confirmado';

export interface Product {
  name: string;
  imageUrl?: string;
  size?: string;
  quantity: number;
}

interface OrderRowProps {
  orderId: string;
  status: OrderStatus;
  deliveryAddress: string;
  products: Product[];
  onCancel: (orderId: string) => void;
  onRepurchase: (orderId: string) => void;
  userType?: 'buyer' | 'seller';
}

/**
 * Componente que representa una fila completa de un pedido (Vista Comprador - Diseño Final).
 * Esta versión usa MUI y Tailwind manteniendo los estilos originales.
 *
 * @param orderId - ID del pedido (ej: #00001)
 * @param status - Estado actual del pedido
 * @param deliveryAddress - Dirección de entrega
 * @param products - Lista de productos en el pedido
 * @param onCancel - Función para cancelar el pedido
 * @param onRepurchase - Función para volver a comprar
 */
const OrderRow: React.FC<OrderRowProps> = ({
  orderId,
  status,
  deliveryAddress,
  products,
  onCancel,
  onRepurchase,
  userType
}) => {
  // Determina el color del chip según el estado
  const getStatusStyles = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'Enviado':
        return { bg: '#d4edda', color: '#155724' };
      case 'Cancelado':
        return { bg: '#f8d7da', color: '#721c24' };
      case 'Pendiente':
        return { bg: '#fff3cd', color: '#856404' };
      case 'Confirmado':
        return { bg: '#cce5ff', color: '#004085' };
      default:
        return { bg: '#eeeeee', color: '#333' };
    }
  };

  const statusStyles = getStatusStyles(status);

  // El botón de cancelar está DESHABILITADO si el pedido ya está Enviado o Cancelado
  const isCancelDisabled = ['Enviado', 'Cancelado'].includes(status);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 1,
        padding: 2,
        marginBottom: 2,
        boxShadow: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {/* ENCABEZADO (Estado, ID y Dirección) */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', marginBottom: 2, gap: 1 }}>
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: statusStyles.bg,
              color: statusStyles.color,
              fontSize: '13px',
              fontWeight: 500,
              height: 'auto',
              padding: '2px 6px',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: '13px',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Pedido nro: {orderId} • {deliveryAddress}
          </Typography>
        </Box>

        {/* LISTA DE PRODUCTOS DENTRO DEL PEDIDO */}
        {products.map((product, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 1.5 }}
          >
            <img
              src={product.imageUrl || 'https://via.placeholder.com/70x70?text=Prod'}
              alt={product.name}
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginRight: '16px',
                flexShrink: 0,
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'text.primary',
                  margin: 0,
                }}
              >
                {product.name} {product.size && `talle ${product.size}`}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  marginTop: '2px',
                }}
              >
                {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* BOTONES DE ACCIÓN (Derecha, apilados) */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1, 
        flexShrink: 0, 
        minWidth: '140px' 
      }}>
        {/* Botón 1: Cancelar Pedido */}
        <Button
          variant="contained"
          onClick={() => !isCancelDisabled && onCancel(orderId)}
          disabled={isCancelDisabled}
          size="small"
          sx={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: isCancelDisabled ? '#e0e0e0' : '#e0e0e0',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: isCancelDisabled ? '#e0e0e0' : '#d0d0d0',
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#ffffff',
              opacity: 0.7,
            },
          }}
        >
          Cancelar Pedido
        </Button>

        {/* Botón 2: Volver a Comprar */}
        <Button
          variant="contained"
          onClick={() => onRepurchase(orderId)}
          size="small"
          sx={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: '#FB9635',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '3px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#e8852a',
              boxShadow: 'none',
            },
          }}
        >
          Volver a Comprar
        </Button>
      </Box>
    </Box>
  );
};

export default OrderRow;
