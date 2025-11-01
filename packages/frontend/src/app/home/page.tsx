'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import { useRouter } from 'next/navigation';
import { Typography, Box, Container, Button } from '@mui/material';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Home() {
  const [currentPage] = useState(1);
  const pageSize = 8;

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
    },
  {
    _id: "6",
    vendedor: "yo",
    titulo: "Gorra Tienda Sol",
    descripcion: "Unisex, ajustable",
    precio: 15.99,
    moneda: "USD",
    stock: 20,
    totalVendido: 60,
    fotos: ["https://assets.adidas.com/images/w_1880,f_auto,q_auto/ff663c5d6fe3482987d73f5d85a9322d_9366/II0702_01_standard.jpg"]
  },
  {
    _id: "7",
    vendedor: "yo",
    titulo: "Mochila Urbana",
    descripcion: "Espaciosa y resistente",
    precio: 79.99,
    moneda: "USD",
    stock: 10,
    totalVendido: 80,
    fotos: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/carrying-cases/cp5625g/media-gallery/backpack-dell-pro-cp5625g-gy-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=849&qlt=100,1&resMode=sharp2&size=849,804&chrss=full"]
  },
  {
    _id: "8",
    vendedor: "yo",
    titulo: "Camisa Blanca",
    descripcion: "Slim fit, talle M",
    precio: 49.99,
    moneda: "USD",
    stock: 12,
    totalVendido: 55,
    fotos: ["https://images.bewakoof.com/original/men-s-white-cotton-shirt-538469-1661765773-1.jpg"]
  }
  ]);

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
    speed: 7000, // velocidad de transición (más alto = más lento)
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // ← esto es clave para que no haya pausa entre slides
    cssEase: 'linear', // ← hace que el movimiento sea constante
    pauseOnHover: false, // opcional: evita que se detenga al pasar el mouse
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 4 } },
        { breakpoint: 768, settings: { slidesToShow: 3 } },
        { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
    };

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

      <main
        role="main"
        aria-label="Página principal de Tienda Sol"
        className="flex-grow py-12"
        style={{ backgroundColor: '#EDEDED' }}
      >
        <Container maxWidth="lg">
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
                }
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
                }
              }}
            >
              Lo más vendido
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Súmate a la tendencia con nuestra cuidada selección de los estilos más vendidos.
            </Typography>
          </Box>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 place-items-center">
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onAddToCart={() => alert("Agregar al carrito: " + prod.titulo)}
              />
            ))}
          </div>

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

          <Box className="text-center mb-10 mt-20" role="region" aria-label="Vendedores destacados">
            <Typography variant="h4" className="font-bold text-oxford-blue mb-2">
              Vendedores que más destacan
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Marcas que están marcando tendencia en Tienda Sol
            </Typography>
          </Box>

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
        </Container>
      </main>

      <Footer />
    </div>
  );
}