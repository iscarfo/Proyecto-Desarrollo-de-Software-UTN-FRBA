'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import { useRouter } from 'next/navigation';
import { Typography, Box, Container, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Home() {
  const [currentPage] = useState(1);
  const pageSize = 8;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  // Fetch de productos al cargar la página
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/productos');
        console.log('Datos del backend:', res.data);
        setProducts(res.data.data || []);
      } catch (err: any) {
        console.error('Error al obtener productos:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrado por búsqueda
  const filteredProducts = products.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación (sobre los productos filtrados)
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  const handleVerMas = () => {
    router.push('/products');
  };

  const marcasDestacadas = [
    { nombre: 'Marca A', logo: '/img/Levis_logo.png' },
    { nombre: 'Marca B', logo: '/img/CK_Calvin_Klein_logo.png' },
    { nombre: 'Marca C', logo: '/img/Chanel_logo.png' },
    { nombre: 'Marca D', logo: '/img/ZARA-logo.png' },
    { nombre: 'Marca E', logo: '/img/Ralph-Lauren-Logo.png' },
    { nombre: 'Marca F', logo: '/img/kevingston.png' },
    { nombre: 'Marca G', logo: '/img/puma-golf.png' },
    { nombre: 'Marca H', logo: '/img/Lacoste-logo.png' },
    { nombre: 'Marca I', logo: '/img/Fila-Logo-1.png' },
    { nombre: 'Marca J', logo: '/img/adidas.jpg' },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 7000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" 
      showSearch={true}
      searchPlaceholder="Buscar productos..."
      onSearch={setSearchTerm}/>

      <main
        role="main"
        aria-label="Página principal de Tienda Sol"
        className="flex-grow py-12"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <Container maxWidth="lg">

          {/* Loading / Error states */}
          {loading && <Typography>Cargando productos...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {!loading && !error && (
            <>
              <Box className="text-center mb-8">
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'var(--oxford-blue)',
                    mb: 4,
                    fontSize: {
                      xs: '2rem',
                      sm: '2.5rem',
                      md: '3rem',
                    },
                  }}
                >
                  Bienvenido a Tienda Sol
                </Typography>
                <Typography variant="h5" className="text-oxford-blue mb-4">
                  Tu tienda online de confianza
                </Typography>
              </Box>

              <Box className="text-center mb-14" role="region" aria-label="Sección Lo más vendido">
                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'var(--oxford-blue)',
                    mb: 2,
                    fontSize: {
                      xs: '1.5rem',
                      sm: '1.75rem',
                      md: '2rem',
                    },
                  }}
                >
                  Lo más vendido
                </Typography>
                <Typography variant="subtitle1" className="text-gray-600 mb-6">
                  Súmate a la tendencia con nuestra cuidada selección de los estilos más vendidos.
                </Typography>
              </Box>

              {/* Grilla de productos */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 place-items-center">
                {paginatedProducts.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onAddToCart={() => alert("Agregar al carrito: " + prod.titulo)}
                  />
                ))}
              </div>

              {/* Botón Ver más */}
              <Box sx={{ marginTop: 3 }} className="text-center">
                <Button
                  onClick={handleVerMas}
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  aria-label="Ver más productos"
                  sx={{ mt: 3 }}
                >
                  Ver Más
                </Button>
              </Box>

              {/* Sección de marcas */}
              <Box className="text-center mb-10 mt-20" role="region" aria-label="Vendedores destacados">
                <Typography variant="h4" className="font-bold text-oxford-blue mb-2">
                  Vendedores que más destacan
                </Typography>
                <Typography variant="subtitle1" className="text-gray-600">
                  Marcas que están marcando tendencia en Tienda Sol
                </Typography>
              </Box>

              {/* Carrusel de marcas */}
              <Box sx={{ mb: 10 }} role="region" aria-label="Carrusel de marcas destacadas">
                <Slider {...sliderSettings}>
                  {marcasDestacadas.map((marca, index) => (
                    <Box key={index} sx={{ padding: 2, textAlign: 'center' }}>
                      <img
                        src={marca.logo}
                        alt={`Logo de ${marca.nombre}`}
                        style={{ maxHeight: '80px', margin: '0 auto', objectFit: 'contain' }}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}