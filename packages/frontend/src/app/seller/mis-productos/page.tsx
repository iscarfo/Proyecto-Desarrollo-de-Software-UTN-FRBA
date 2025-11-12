'use client';
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import {
  Container,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

export default function AdminProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const vendedorId = "68d82ab654219bb082182057";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/productos?vendedorId=${vendedorId}&page=${currentPage}&limit=${pageSize}`
        );

        if (res.status === 204) {
          setProducts([]);
          setTotalPages(1);
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        console.log("payload:", payload);

        // Detecta la forma correcta del backend
        const productsArray =
          Array.isArray(payload)
            ? payload
            : Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload.productos)
            ? payload.productos
            : [];

        setProducts(productsArray);
        setTotalPages(payload.totalPaginas || Math.ceil(productsArray.length / pageSize) || 1);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setProducts([]);
        setTotalPages(1);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p._id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
    }
  };

  const handleDelete = (productId: string) => {
    console.log("Eliminar producto:", productId);
  };

  const handleSaveChanges = () => {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
    );
    console.log("Producto actualizado:", editingProduct);
    setEditingProduct(null);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Navbar userType="seller" />

      <main
        role="main"
        aria-label="Sección de productos del vendedor"
        className="flex-grow py-12"
      >
        
        <Container maxWidth="lg" className="flex gap-8">
          

          <Box className="flex-1">
            <Typography
                variant="h4"
                sx={{ marginBottom: 3, fontWeight: 'bold', color: 'primary.main' }}
              >
                Mis Productos
          </Typography>
            <div
              role="region"
              aria-label="Listado de productos"
              className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 place-items-center"
            >
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

            <Box sx={{ marginTop: 4 }} aria-label="Paginación de productos">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Box>
        </Container>
      </main>

      {editingProduct && (
        <Dialog
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          aria-labelledby="editar-producto"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="editar-producto">Editar producto</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              value={editingProduct.titulo}
              onChange={(e) =>
                setEditingProduct((prev) =>
                  prev ? { ...prev, titulo: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              value={editingProduct.descripcion}
              onChange={(e) =>
                setEditingProduct((prev) =>
                  prev ? { ...prev, descripcion: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Precio"
              type="number"
              fullWidth
              value={editingProduct.precio}
              onChange={(e) =>
                setEditingProduct((prev) =>
                  prev
                    ? { ...prev, precio: parseFloat(e.target.value) }
                    : prev
                )
              }
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct((prev) =>
                  prev
                    ? { ...prev, stock: parseInt(e.target.value) }
                    : prev
                )
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingProduct(null)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveChanges}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}