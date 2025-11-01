'use client';
import React, { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination"; // ← Agregar esta importación
import { Container, Box, Typography, Divider, TextField } from "@mui/material";

export default function AdminProductsPage() {

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // productos por página

  // Datos de ejemplo TEMPORALES
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
      precio: 59.99,
      moneda: "DOLAR_USA",
      stock: 5,
      totalVendido: 100,
      fotos: ["https://i.postimg.cc/4dBtbbTd/bolso.jpg"]
    },
    {
      _id: "3",
      vendedor: "yo",
      titulo: "Zapatillas Tienda Sol",
      descripcion: "Cómodas y a la moda",
      precio: 49.99,
      moneda: "DOLAR_USA",
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
      moneda: "DOLAR_USA",
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
      moneda: "DOLAR_USA",
      stock: 8,
      totalVendido: 20,
      fotos: ["https://i.postimg.cc/fLj549nq/modazapa.jpg"]
    },
    {
      _id: "6",
      vendedor: "yo",
      titulo: "Remera Blanca",
      descripcion: "Talle L. Algodón premium",
      precio: 35.99,
      moneda: "DOLAR_USA",
      stock: 15,
      totalVendido: 89,
      fotos: ["https://acdn-us.mitiendanube.com/stores/001/203/421/products/an29-110415-removebg-preview-4f8315b62c4aa1287917563899571320-480-0.png"]
    },
    {
      _id: "7",
      vendedor: "yo",
      titulo: "Sweater Cremita",
      descripcion: "Talle S. Suave y abrigado",
      precio: 69.99,
      moneda: "DOLAR_USA",
      stock: 10,
      totalVendido: 76,
      fotos: ["https://static.wixstatic.com/media/9dcd07_866084503fb64d8e8aea6f5286674a4e~mv2.png"]
    },
    {
      _id: "8",
      vendedor: "yo",
      titulo: "Pantalón Negro",
      descripcion: "Clásico y versátil",
      precio: 79.99,
      moneda: "DOLAR_USA",
      stock: 14,
      totalVendido: 65,
      fotos: ["https://juanperez.com.ar/cdn/shop/files/5488801.T38_284_29.jpg?v=1729261528"]
    },
    {
      _id: "9",
      vendedor: "yo",
      titulo: "Camisa Azul",
      descripcion: "Talle M. Perfecta para ocasiones formales",
      precio: 54.99,
      moneda: "DOLAR_USA",
      stock: 9,
      totalVendido: 58,
      fotos: ["https://www.wessi.com/cdn/shop/files/4_59a965a0-1caf-4241-b0aa-e24ed8d5fc5f.jpg?v=1726733385&width=1080"]
    },
    {
      _id: "10",
      vendedor: "yo",
      titulo: "Zapatillas Rojas",
      descripcion: "Talle 42. Estilo deportivo",
      precio: 89.99,
      moneda: "DOLAR_USA",
      stock: 6,
      totalVendido: 45,
      fotos: ["https://http2.mlstatic.com/D_693634-MLA83771250445_042025-O.jpg"]
    }
  ]);

  const totalPages = Math.ceil(products.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handleEdit = (productId: string) => {
    console.log("Editar producto:", productId);
    // aca modal de edición
  };

  const handleDelete = (productId: string) => {
    console.log("Eliminar producto:", productId);
    // aca modal de confirmación
  };

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Navbar userType="seller" /> {/* Cambia a seller */}

      <main className="flex-grow py-12">
        <Container maxWidth="lg" className="flex gap-8">
          {/* ... filtros ... */}

          <Box className="flex-1">
            {/* Productos */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 place-items-center">
              {paginatedProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  userType="seller"
                  onEdit={() => handleEdit(prod._id)}
                  onDelete={() => handleDelete(prod._id)}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            <Box sx={{ marginTop: 4 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Box>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
