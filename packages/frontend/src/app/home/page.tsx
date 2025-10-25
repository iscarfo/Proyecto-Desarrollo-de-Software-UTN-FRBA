'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import { useRouter } from 'next/navigation';
import { Typography, Box, Container, Button } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentPage] = useState(1);
  const pageSize = 3;

  const [products] = useState<Product[]>([
    {
      _id: "1",
      vendedor: "yo",
      titulo: "Remera Cremita",
      descripcion: "Talle M. Algodón",
      precio: 39.99,
      moneda: "DOLAR_USA",
      stock: 12,
      totalVendido: 102,
      fotos: ["https://i.postimg.cc/2yrvnctP/remera.jpg"]
    },
    {
      _id: "2",
      vendedor: "yo",
      titulo: "Bolsa Tienda Sol",
      descripcion: "Perfecta para tu día a día",
      precio: 259.99,
      moneda: "REAL",
      stock: 5,
      totalVendido: 100,
      fotos: ["https://i.postimg.cc/4dBtbbTd/bolso.jpg"]
    },
    {
      _id: "3",
      vendedor: "yo",
      titulo: "Zapatillas Tienda Sol",
      descripcion: "Cómodas y a la moda",
      precio: 120000,
      moneda: "PESO_ARG",
      stock: 8,
      totalVendido: 98,
      fotos: ["https://i.postimg.cc/BQDbJcwm/zapas.jpg", "https://i.postimg.cc/501qm2Yh/remeron-bordo.jpg"]
    },
    {
      _id: "4",
      vendedor: "yo",
      titulo: "Remera Roja",
      descripcion: "Oversize",
      precio: 19.99,
      moneda: "USD",
      stock: 8,
      totalVendido: 25,
      fotos: ["https://i.postimg.cc/501qm2Yh/remeron-bordo.jpg"]
    },
    {
      _id: "5",
      vendedor: "yo",
      titulo: "Zapatillas Deportivas",
      descripcion: "Cómodas y a la moda",
      precio: 49.99,
      moneda: "USD",
      stock: 8,
      totalVendido: 20,
      fotos: ["https://i.postimg.cc/fLj549nq/modazapa.jpg"]
    }
  ]);

  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  const router = useRouter();

  const handleVerMas = () => {
    router.push('/products');
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

          {/*Título */}
          <Box className="text-center mb-14">
            <Typography variant="h3" className="font-bold text-oxford-blue mb-2">
              Lo más vendido
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Súmate a la tendencia con nuestra cuidada selección de los estilos más vendidos.
            </Typography>
          </Box>

          {/* Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onAddToCart={() => alert("Agregar al carrito: " + prod.titulo)}
              />
            ))}
          </div>

          {/*Ver mas */}
          <Box sx={{ marginTop: 3 }} className="text-center">
            <Button
              onClick={handleVerMas}
              variant="outlined"
              disabled={currentPage === totalPages}
              sx={{ mt: 3 }}
            >
              Ver Más
            </Button>
          </Box>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
