'use client';
import React, { useState, useEffect, Suspense } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";

import axios from "axios";
import { useCart } from "../../store/CartContext";
import { formatNumber } from "../../utils/formatPrice";

// --- Componente para sincronizar "search" en query params ---
function SearchParamsHandler({ onSearchTermChange }: { onSearchTermChange: (term: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const param = searchParams.get("search");
    if (param) onSearchTermChange(param);
  }, [searchParams, onSearchTermChange]);

  return null;
}

function ProductosPageContent() {
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

  // rango de precios dinámico del backend
  const [precioRangoMin, setPrecioRangoMin] = useState<number | null>(null);
  const [precioRangoMax, setPrecioRangoMax] = useState<number | null>(null);
  const [precioSliderValue, setPrecioSliderValue] = useState<number[]>([0, 0]);

  const pageSize = 6;
  const [searchTerm, setSearchTerm] = useState("");

  // --- FETCH productos ---
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

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productos`, { params });

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

  // --- cargar categorías ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productos/categorias`);
        setCategorias(res.data || []);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategorias();
  }, []);

  // --- obtener rango de precios dinámico del backend ---
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        // Query para obtener el precio mínimo (ordenar ascendente)
        const resMin = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
          params: { sort: 'precio_asc', limit: 1 }
        });

        // Query para obtener el precio máximo (ordenar descendente)
        const resMax = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
          params: { sort: 'precio_desc', limit: 1 }
        });

        const minPrice = resMin.data.data?.[0]?.precio ?? 0;
        const maxPrice = resMax.data.data?.[0]?.precio ?? 0;

        setPrecioRangoMin(minPrice);
        setPrecioRangoMax(maxPrice);
        setPrecioSliderValue([minPrice, maxPrice]);
      } catch (err) {
        console.error("Error al cargar rango de precios", err);
      }
    };
    fetchPriceRange();
  }, []);

  // --- busqueda ---
  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleApplyFilters = () => {
    // Actualizar los valores de filtro desde el slider
    setPrecioMin(precioSliderValue[0].toString());
    setPrecioMax(precioSliderValue[1].toString());
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleClearFilters = () => {
    setPrecioMin("");
    setPrecioMax("");
    setCategoria("");
    setSort("");
    setSearchTerm("");
    // Resetear slider a valores originales
    if (precioRangoMin !== null && precioRangoMax !== null) {
      setPrecioSliderValue([precioRangoMin, precioRangoMax]);
    }
    setCurrentPage(1);
    fetchProducts(1, "");
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPrecioSliderValue(newValue as number[]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // --------------------------------------
  // *** COMPONENTE REUTILIZADO DE FILTROS ***
  // --------------------------------------
  const FiltersContent = () => (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>Precio</Typography>

      {precioRangoMin !== null && precioRangoMax !== null ? (
        <Box sx={{ px: 1 }}>
          <Slider
            value={precioSliderValue}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={precioRangoMin}
            max={precioRangoMax}
            sx={{ color: "#ff9800" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ${formatNumber(precioSliderValue[0])}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${formatNumber(precioSliderValue[1])}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">Cargando precios...</Typography>
      )}

      <Divider sx={{ my: 3 }} />

      <FormControl fullWidth size="small">
        <InputLabel>Categoría</InputLabel>
        <Select value={categoria} label="Categoría" onChange={(e) => setCategoria(e.target.value)}>
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>{cat.nombre}</MenuItem>
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

      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleApplyFilters}>
        Aplicar filtros
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleClearFilters}>
        Limpiar filtros
      </Button>
    </>
  );

  // -------------------------------------------------------------------

  return (
    <div className="min-h-screen flex flex-col bg-platinum">

      <Suspense fallback={null}>
        <SearchParamsHandler onSearchTermChange={setSearchTerm} />
      </Suspense>

      <Navbar showSearch={true} searchPlaceholder="Buscar productos..." onSearch={setSearchTerm} />

      <main className="flex-grow py-12">

        {/* CAMBIO: flex-col en mobile, flex-row en desktop */}
        <Container
          maxWidth="lg"
          className="flex flex-col md:flex-row gap-8 items-stretch"
        >

          {/* -------- FILTROS MOBILE (ACCORDION) -------- */}
          <Box className="md:hidden w-full mb-8 mt-2">
            <Accordion sx={{ borderRadius: "8px", overflow: "hidden" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: "white", "&:before": { display: "none" } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <FilterListIcon />
                  <Typography fontWeight={600}>Filtros y Ordenamiento</Typography>
                </Box>
              </AccordionSummary>

              {/* Más espacio al abrir */}
              <AccordionDetails sx={{ backgroundColor: "white", mt: 1 }}>
                {FiltersContent()}
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* -------- FILTROS DESKTOP -------- */}
          <aside className="w-60 hidden md:block bg-white p-4 rounded-lg shadow">
            {FiltersContent()}
          </aside>

          {/* -------- PRODUCTOS -------- */}
          <Box className="flex-1">
            {loading && <Typography align="center" mt={4}>Cargando productos...</Typography>}

            {error && <Typography color="error" align="center" mt={4}>{error}</Typography>}

            {!loading && !error && products.length === 0 && (
              <Typography align="center" mt={4}>No se encontraron productos.</Typography>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} userType="buyer" />
                ))}
              </div>
            )}
          </Box>
        </Container>

        {!loading && !error && products.length > 0 && (
          <Container maxWidth="lg">
            <Box sx={{ marginTop: 4 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          </Container>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductosPageContent />
    </Suspense>
  );
}
