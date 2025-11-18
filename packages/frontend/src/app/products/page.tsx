'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import {
  Container,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useCart } from "../../store/CartContext";

export default function ProductosPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [categorias, setCategorias] = useState<{ _id: string; nombre: string }[]>([]);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sort, setSort] = useState("");

  const pageSize = 6;

  
  const [searchTerm, setSearchTerm] = useState("");

  
  const searchParams = useSearchParams();

  
  useEffect(() => {
    const param = searchParams.get("search");
    if (param) {
      setSearchTerm(param);
    }
  }, [searchParams]);

  const fetchProducts = async (page = currentPage, search = searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: pageSize.toString(),
      };

      if (search) params.nombre = search;
      if (precioMin) params.precioMin = precioMin;
      if (precioMax) params.precioMax = precioMax;
      if (categoria) params.categoria = categoria;
      if (sort) params.sort = sort;

      const res = await axios.get("http://localhost:3000/productos", { params });

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPaginas || 1);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sort]);

  //obtener categorias del back
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("http://localhost:3000/productos/categorias");
        setCategorias(res.data || []);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  //busqueda en navbar
  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, searchTerm);
    }, 500); // debounce
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Navbar
        userType="buyer"
        showSearch={true}
        searchPlaceholder="Buscar productos..."
        onSearch={setSearchTerm}
      />

      <main role="main" aria-label="Sección de productos" className="flex-grow py-12">
        <Container maxWidth="lg" className="flex gap-8">

          {/* FILTROS */}
          <aside className="w-60 hidden md:block bg-white p-4 rounded-lg shadow">
            <Typography variant="h6" fontWeight={700} mb={2}>Precio</Typography>
            <TextField
              fullWidth
              size="small"
              label="Min"
              type="number"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Max"
              type="number"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />

            <Divider sx={{ my: 3 }} />

            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoria}
                label="Categoría"
                onChange={(e) => setCategoria(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} mb={2}>Ordenar por</Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Orden</InputLabel>
              <Select
                value={sort}
                label="Orden"
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">Predeterminado</MenuItem>
                <MenuItem value="mas_vendidos">Más vendidos</MenuItem>
                <MenuItem value="precio_asc">Menor precio</MenuItem>
                <MenuItem value="precio_desc">Mayor precio</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleApplyFilters}
            >
              Aplicar filtros
            </Button>
          </aside>

          {/* GRID DE PRODUCTOS */}
          <Box className="flex-1">
            {loading && <Typography align="center" mt={4}>Cargando productos...</Typography>}
            {error && <Typography color="error" align="center" mt={4}>{error}</Typography>}
            {!loading && !error && products.length === 0 && (
              <Typography align="center" mt={4}>No se encontraron productos.</Typography>
            )}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
                {products.map((prod) => (
                <ProductCard
                key={prod._id}
                product={prod}
                userType="buyer"
                />
                ))}
              </div>

                {/* PAGINACIÓN */}
                <Box sx={{ marginTop: 4 }} aria-label="Paginación de productos">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </>
            )}
          </Box>
        </Container>
      </main>

      <Footer />
    </div>
  );
}