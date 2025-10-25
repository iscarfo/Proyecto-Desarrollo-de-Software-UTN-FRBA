'use client';
import React from 'react';
import { Button, Card, CardMedia, Typography, Box } from "@mui/material";

export interface Product {
  _id: string;
  vendedor: string;
  titulo: string;
  descripcion: string;
  categorias?: string[];
  precio: number;
  moneda: string;
  stock: number;
  totalVendido: number;
  fotos?: string[];
}

interface Props {
  product: Product;
  userType?: 'buyer' | 'seller';
  onAddToCart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  userType = 'buyer',
  onAddToCart,
  onEdit,
  onDelete
}) => {
  // Función para formatear el precio con la moneda correcta
  const formatPrice = (precio: number, moneda: string) => {
    switch (moneda) {
      case "PESO_ARG":
        return `$${precio} ARS`;
      case "DOLAR_USA":
        return `US$${precio}`;
      case "EUR":
        return `€${precio}`;
      default:
        return `$${precio}`;
    }
  };

  return (
    <Card
      sx={{
        width: 260,
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        ":hover": {
          transform: "scale(1.03)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* Imagen del producto */}
      <CardMedia
        component="img"
        image={product.fotos?.[0] || "/placeholder.jpg"}
        alt={product.titulo}
        sx={{
          width: "100%",
          borderRadius: 2,
          objectFit: "cover",
          height: 200,
        }}
      />

      {/* titulo y precio */}
      <Typography
        sx={{ mt: 2, fontWeight: 600, fontSize: "1.1rem", textAlign: "center" }}
      >
        {product.titulo}
      </Typography>

      <Typography sx={{ color: "#444", mt: 0.5, fontWeight: 500 }}>
        {formatPrice(product.precio, product.moneda)}
      </Typography>

      {/* Mostrar stock para vendedores */}
      {userType === 'seller' && (
        <Typography sx={{ color: "#666", mt: 0.5, fontSize: "0.9rem" }}>
          Stock: {product.stock} | Vendidos: {product.totalVendido}
        </Typography>
      )}

      {/* Botones según tipo de usuario */}
      {userType === 'buyer' ? (
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#ff9800",
            fontWeight: 600,
            ":hover": { backgroundColor: "#e68900" },
          }}
          onClick={onAddToCart}
        >
          Agregar al carrito
        </Button>
      ) : (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            //startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{ flex: 1 }}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            //startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{ flex: 1 }}
          >
            Eliminar
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;