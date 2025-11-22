"use client";
import React, { useState, useEffect } from "react";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export default function MisProductosView() {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [alerta, setAlerta] = useState({ open: false, tipo: "success", mensaje: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
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

  const categoriasDisponibles = [
    { value: "68e2d9437062c45d2163793a", label: "Running" },
    { value: "68e2d9437062c45d2163793b", label: "Calzado" },
    { value: "68e2d9437062c45d2163793d", label: "Indumentaria" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/usuarios/productos?page=${currentPage}&limit=${pageSize}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (res.status === 204) {
          setProducts([]);
          setTotalPages(1);
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();

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
  }, [currentPage, getToken]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p._id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      const token = await getToken();
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/productos/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setAlerta({
          open: true,
          tipo: "success",
          mensaje: "Producto eliminado con éxito.",
        });
      }
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      setAlerta({
        open: true,
        tipo: "error",
        mensaje: error.response?.data?.message || "Error al eliminar el producto",
      });
    }
  };

const handleSaveChanges = async () => {
    if (!editingProduct) return;

    try {
      const token = await getToken();
      const payload = {
        titulo: editingProduct.titulo,
        descripcion: editingProduct.descripcion,
        precio: Number(editingProduct.precio),
        stock: Number(editingProduct.stock),
      };

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/productos/${editingProduct._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
        );
        setEditingProduct(null);
        setAlerta({
          open: true,
          tipo: "success",
          mensaje: "Producto actualizado con éxito.",
        });
      }
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      setAlerta({
        open: true,
        tipo: "error",
        mensaje: error.response?.data?.message || "Error al actualizar el producto",
      });
    }
  };

  const handleGuardarProducto = async () => {
    try {
      const token = await getToken();
      const payload = {
        titulo: nuevoProducto.titulo,
        descripcion: nuevoProducto.descripcion,
        precio: Number(nuevoProducto.precio),
        moneda: nuevoProducto.moneda,
        stock: Number(nuevoProducto.stock),
        categorias: nuevoProducto.categorias,
        fotos: nuevoProducto.fotos,
        activo: nuevoProducto.activo,
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/productos`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (res.status === 201 || res.status === 200) {
        const creado = res.data && (res.data._id ? res.data : (res.data.producto || res.data.data || null));
        if (creado && creado._id) {
          setProducts((prev) => [creado, ...prev]);
        } else {
          const token = await getToken();
          const refetch = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/productos?page=${currentPage}&limit=${pageSize}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
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
        setAlerta({
          open: true,
          tipo: "success",
          mensaje: "Producto creado con éxito.",
        });
      }
    } catch (error: any) {
      console.error("Error en POST /productos:", error);
      setAlerta({
        open: true,
        tipo: "error",
        mensaje: "Error al crear el producto",
      });
    }
  };

  return (

    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Catálogo de Productos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
        >
        Agregar producto
      </Button>

      <div
        role="region"
        aria-label="Listado de productos"
        className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 place-items-center"
      >
        {products.map((prod) => (
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


      {/* Dialog para crear producto */}
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

      {/* Dialog de edición */}
      {editingProduct && (
        <Dialog
          open={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Editar producto</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Título"
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

      {/* Snackbar */}
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
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}