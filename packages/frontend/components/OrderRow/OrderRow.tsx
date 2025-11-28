'use client';
import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';

export type OrderStatus = 'ENVIADO' | 'CANCELADO' | 'PENDIENTE' | 'CONFIRMADO';

export interface Product {
  name: string;
  imageUrl?: string;
  size?: string;
  quantity: number;
}

// --- INTERFAZ MODIFICADA ---
// Añadimos las props opcionales para el VENDEDOR
interface OrderRowProps {
  orderId: string;
  status: OrderStatus;
  deliveryAddress: string;
  fechaCreacion: string; 
  products: Product[];
  userType?: 'buyer' | 'seller';

  // Props del Comprador (ya existían)
  onCancel?: (orderId: string) => void;
  onRepurchase?: (orderId: string) => void;

  // Props del Vendedor (NUEVAS)
  onConfirm?: (orderId: string) => void;
  onSend?: (orderId: string) => void;
  onCancelSeller?: (orderId: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
  orderId,
  status,
  deliveryAddress,
  fechaCreacion,
  products,
  userType = 'buyer', // Por defecto es 'buyer' si no se especifica
  onCancel,
  onRepurchase,
  onConfirm,
  onSend,
  onCancelSeller,
}) => {
  // Determina el color del chip según el estado
  const getStatusStyles = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'ENVIADO':
        return { bg: '#d4edda', color: '#155724' }; // Verde
      case 'CANCELADO':
        return { bg: '#f8d7da', color: '#721c24' }; // Rojo
      case 'PENDIENTE':
        return { bg: '#fff3cd', color: '#856404' }; // Amarillo
      case 'CONFIRMADO':
        return { bg: '#cce5ff', color: '#004085' }; // Azul
      default:
        return { bg: '#eeeeee', color: '#333' };
    }
  };

  const statusStyles = getStatusStyles(status);

  // --- LÓGICA DE BOTONES DEL VENDEDOR ---
  const renderSellerButtons = () => {
    const isPending = status === 'PENDIENTE';
    const isConfirmed = status === 'CONFIRMADO';
    const isFinished = status === 'ENVIADO' || status === 'CANCELADO';

    // Estilo de los botones del vendedor — más consistente con los
    // botones del comprador: anchura completa en móvil, nowrap, padding y
    // bordes ligeramente redondeados.
    const adminButtonSx = (disabled: boolean) => ({
      width: '100%',
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'none',
      whiteSpace: 'nowrap',
      backgroundColor: disabled ? '#B0B0B0' : '#FB9635',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '6px',
      boxShadow: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        backgroundColor: disabled ? '#B0B0B0' : '#e8852a',
        boxShadow: 'none',
      },
    });

    // Estilo para el botón de cancelar (rojo), mantiene mismo rojo usado
    // para los botones de cancelar del comprador para consistencia.
    const cancelButtonSx = (disabled: boolean) => ({
      width: '100%',
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'none',
      whiteSpace: 'nowrap',
      // color: slightly darker red for better contrast and page consistency
      backgroundColor: disabled ? '#B0B0B0' : '#C62828',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '6px',
      boxShadow: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        backgroundColor: disabled ? '#B0B0B0' : '#B71C1C',
        boxShadow: 'none',
      },
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0, minWidth: { xs: '100%', sm: '220px' } }}>
        <Button
          variant="contained"
          onClick={() => onConfirm?.(orderId)}
          disabled={!isPending}
          sx={adminButtonSx(!isPending)}
        >
          Confirmar
        </Button>
        <Button
          variant="contained"
          onClick={() => onSend?.(orderId)}
          disabled={!isConfirmed}
          sx={adminButtonSx(!isConfirmed)}
        >
          Enviar
        </Button>
        <Button
          variant="contained"
          onClick={() => onCancelSeller?.(orderId)}
          disabled={isFinished}
          sx={cancelButtonSx(isFinished)}
        >
          Cancelar
        </Button>
      </Box>
    );
  };

  // --- LÓGICA DE BOTONES DEL COMPRADOR ---
  const renderBuyerButtons = () => {
    const isCancelDisabled = status === 'ENVIADO' || status === 'CANCELADO';

    // Make room for the full label and keep layout responsive
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0, minWidth: { xs: '100%', sm: '220px' } }}>
        {/* Volver a Comprar first (top) */}
        <Button
          variant="contained"
          onClick={() => onRepurchase?.(orderId)}
          sx={{
            width: '100%',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            backgroundColor: '#FB9635',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#e8852a',
              boxShadow: 'none',
            },
          }}
        >
          Volver a Comprar
        </Button>

        {/* Cancelar pedido below */}
        <Button
          variant="contained"
          onClick={() => onCancel?.(orderId)}
          disabled={isCancelDisabled}
          sx={{
            width: '100%',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            // darker red tone to match seller cancel button
            backgroundColor: isCancelDisabled ? '#B0B0B0' : '#C62828',
            color: '#FFFFFF',
            cursor: isCancelDisabled ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: isCancelDisabled ? '#B0B0B0' : '#B71C1C',
            },
          }}
        >
          Cancelar pedido
        </Button>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 1,
        padding: 2,
        marginBottom: 2,
        boxShadow: 1,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Apilable en móvil
        justifyContent: 'space-between',
        // Mantener alineación en la parte alta en móvil, pero centrar verticalmente
        // cuando la pantalla alcance el breakpoint sm (>= 600px).
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        {/* ENCABEZADO (Estado, ID y Dirección) */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', marginBottom: 2, gap: 1, flexWrap: 'wrap' }}>
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
          {userType === 'seller'
              ? `Pedido nro: ${orderId.slice(0, 6)} • ${deliveryAddress} • ${new Date(fechaCreacion).toLocaleDateString('es-AR')}`
              : `${deliveryAddress} • ${new Date(fechaCreacion).toLocaleDateString('es-AR')}`}          
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

      {/* --- RENDERIZADO CONDICIONAL DE BOTONES --- */}
      <Box sx={{
        width: { xs: '100%', sm: 'auto' },
        // Evitamos un espacio superior cuando la vista es móvil (botones apilados)
        // y permitimos mantener mejor la separación en pantallas grandes.
        mt: { xs: 0, sm: 0 },
        // Si necesitas un pequeño nudging hacia abajo en pantallas grandes,
        // puedes ajustar este valor a sm: 1 o sm: 2. Por ahora usamos centering
        // en el contenedor padre (alignItems: 'center').
      }}>
        {userType === 'seller' ? renderSellerButtons() : renderBuyerButtons()}
      </Box>
    </Box>
  );
};

export default OrderRow;
