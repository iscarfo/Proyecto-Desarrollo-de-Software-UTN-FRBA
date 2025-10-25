'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Typography, Box, Container, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

export default function SellerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="seller" />

      <main className="flex-grow bg-platinum py-12">
        <Container maxWidth="lg">
          <Box className="text-center mb-8">
            <Typography variant="h2" component="h1" className="mb-4 font-bold text-oxford-blue">
              Panel de Vendedor
            </Typography>
            <Typography variant="h5" className="text-oxford-blue mb-4">
              Gestiona tus productos y pedidos
            </Typography>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Tarjeta de Mis Productos (sin cambios) */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                  Mis Productos
                </Typography>
                <Typography variant="body1" className="text-black">
                  Gestiona tu catálogo de productos
                </Typography>
              </CardContent>
            </Card>

            {/* Añadimos el componente Link para que envuelva la tarjeta de Pedidos */}
            <Link href="/seller/pedidos" passHref style={{ textDecoration: 'none' }}>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent>
                  <Typography variant="h5" className="mb-4 text-orange font-bold">
                    Pedidos
                  </Typography>
                  <Typography variant="body1" className="text-black">
                    Administra los pedidos de tus clientes
                  </Typography>
                </CardContent>
              </Card>
            </Link>

            {/* Tarjeta de Estadísticas (sin cambios) */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Typography variant="h5" className="mb-4 text-oxford-blue font-bold">
                  Estadísticas
                </Typography>
                <Typography variant="body1" className="text-black">
                  Revisa tus métricas de ventas
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}