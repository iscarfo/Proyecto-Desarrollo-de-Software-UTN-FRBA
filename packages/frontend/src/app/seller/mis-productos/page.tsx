"use client";
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
  Button,
  Fab,
  MenuItem
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

export default function AdminProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const vendedorId = "68d82ab654219bb082182057";

  const [alerta, setAlerta] = useState({ open: false, tipo: "success", mensaje: "" });

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    titulo: "",
    descripcion: "",
    precio: 0,
    moneda: "PESO_ARG",
    stock: 0,
    categorias: [] as string[],
    fotos: [] as string[],
    activo: true,
  });

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

  // USAR LOS IDS DE EJEMPLO QUE PROPORCIONASTE
  const categoriasDisponibles = [
    { value: "68e2d9437062c45d2163793a", label: "Running" },
    { value: "68e2d9437062c45d2163793b", label: "Calzado" },
    { value: "68e2d9437062c45d2163793d", label: "Indumentaria" },
  ];

  // AQUÍ: POST al endpoint. Se valida/parsea el body, se muestran logs/alerts y se actualiza la UI.
  const handleGuardarProducto = async () => {
    try {
      // Construyo el payload exactamente como lo pediste
      const payload = {
        usuarioId: vendedorId,
        titulo: nuevoProducto.titulo,
        descripcion: nuevoProducto.descripcion,
        precio: Number(nuevoProducto.precio),
        moneda: nuevoProducto.moneda,
        stock: Number(nuevoProducto.stock),
        categorias: nuevoProducto.categorias, // array de ids (strings)
        fotos: nuevoProducto.fotos,
        activo: nuevoProducto.activo,
      };

      console.log("Enviando payload:", payload);

      const res = await axios.post("http://localhost:3000/productos", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Respuesta POST:", res.status, res.data);

      // Si el backend devuelve el producto creado, lo agrego directamente al state.
      if (res.status === 201 || res.status === 200) {
        const creado = res.data && (res.data._id ? res.data : (res.data.producto || res.data.data || null));
        if (creado && creado._id) {
          setProducts((prev) => [creado, ...prev]); // lo pongo al principio
        } else {
          // si no devolvió el creado, vuelvo a pedir la lista
          const refetch = await fetch(
            `http://localhost:3000/productos?vendedorId=${vendedorId}&page=${currentPage}&limit=${pageSize}`
          );
          const data = await refetch.json();
          const lista =
            Array.isArray(data) ? data :
            Array.isArray(data.data) ? data.data :
            Array.isArray(data.productos) ? data.productos :
            [];
          setProducts(lista);
        }

        setOpenDialog(false);
        // feedback visual
        setAlerta({
          open: true,
          tipo: "success",
          mensaje: "Producto creado con éxito.",
        });

      } else {
        setAlerta({
          open: true,
          tipo: "error",
          mensaje: "No se ha podido crear el producto",
        });
      }
    } catch (error: any) {
      console.error("Error en POST /productos:", error);
      // Si es CORS o network error axios puede devolver error.request o error.response
      if (error.response) {
        // respuesta del servidor con error
        console.error("Respuesta del servidor:", error.response.data);
        setAlerta({
          open: true,
          tipo: "error",
          mensaje: "Error del servidor: " + JSON.stringify(error.response.data),
        });
      } else if (error.request) {
        console.error("No hubo respuesta (posible CORS o network):", error.request);
        setAlerta({
          open: true,
          tipo: "error",
          mensaje: "No hubo respuesta del servidor. Verifica CORS y que el backend esté corriendo.",
        });
      } else {
        setAlerta({
          open: true,
          tipo: "error",
          mensaje: "Error: " + error.message,
        });
      }
    }
  };

  //const startIndex = (currentPage - 1) * pageSize;
  //const paginatedProducts = products.slice(startIndex, startIndex + pageSize);
  const paginatedProducts = products;


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

        {/* Botón flotante para agregar producto */}
        <Fab
          color="primary"
          aria-label="Agregar producto"
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Dialogo para crear producto */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              value={nuevoProducto.titulo}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, titulo: e.target.value }))
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              value={nuevoProducto.descripcion}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, descripcion: e.target.value }))
              }
            />
            <TextField
              label="Precio"
              type="number"
              fullWidth
              value={nuevoProducto.precio}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, precio: Number(e.target.value) }))
              }
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={nuevoProducto.stock}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, stock: Number(e.target.value) }))
              }
            />
            <TextField
              select
              label="Categoría"
              fullWidth
              value={nuevoProducto.categorias[0] || ""}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, categorias: [e.target.value] }))
              }
            >
              {categoriasDisponibles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="URL de imágenes (separadas por coma)"
              fullWidth
              value={nuevoProducto.fotos.join(", ")}
              onChange={(e) =>
                setNuevoProducto((prev) => ({ ...prev, fotos: e.target.value.split(",").map((f) => f.trim()) }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleGuardarProducto}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
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
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              value={editingProduct.titulo}
              onChange={(e) =>
                setEditingProduct(prev =>
                  prev ? { ...prev, titulo: e.target.value } : prev
                )
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              value={editingProduct.descripcion}
              onChange={(e) =>
                setEditingProduct(prev =>
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
                setEditingProduct(prev =>
                  prev ? { ...prev, precio: parseFloat(e.target.value) } : prev
                )
              }
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct(prev =>
                  prev ? { ...prev, stock: parseInt(e.target.value) } : prev
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

      <Snackbar
        open={alerta.open}
        autoHideDuration={4000}
        onClose={() => setAlerta((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alerta.tipo === "error" ? "error" : "success"}
          variant="filled"
          onClose={() => setAlerta((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>


      <Footer />
    </div>
  );
}