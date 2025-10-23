'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Typography, Box, Container, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="buyer" />

      <main className="flex-grow bg-platinum py-12">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                Productos de Calidad
              </Typography>
              <Typography variant="body1" className="text-black">
                Encuentra los mejores productos al mejor precio
              </Typography>
            </Box>

            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-orange font-bold">
                Envío Rápido
              </Typography>
              <Typography variant="body1" className="text-black">
                Recibe tus pedidos en tiempo récord
              </Typography>
            </Box>

            <Box className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                Soporte 24/7
              </Typography>
              <Typography variant="body1" className="text-black">
                Estamos aquí para ayudarte siempre
              </Typography>
            </Box>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
