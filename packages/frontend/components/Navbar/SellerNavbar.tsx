'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { FiBell, FiUser } from 'react-icons/fi';
import NextLink from 'next/link';
import { Link } from '@mui/material';
import UsuarioMenu from '@/components/UsuarioMenu/usuarioMenu';

export interface NavLink {
  name: string;
  link: string;
}

interface SellerNavbarProps {
  links?: NavLink[];
}

const SellerNavbar: React.FC<SellerNavbarProps> = ({
  links = [
    { name: 'HOME', link: '/seller' },
    { name: 'ADMINISTRAR PEDIDOS', link: '/seller/pedidos' },
    { name: 'MIS PRODUCTOS', link: '/seller/mis-productos' }
  ]
}) => {
  const pathname = usePathname();

  const isNotifications = pathname === '/notificaciones';

  const getLinkStyles = (path: string) => ({
    color: pathname === path ? 'primary.main' : 'inherit',
    backgroundColor: pathname === path ? 'background.paper' : 'transparent',
    textDecoration: 'none',
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: 400,
    borderRadius: 1,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: pathname === path ? 'background.paper' : 'rgba(252, 163, 17, 0.15)',
    },
  });

  return (
    <AppBar position="static">
      <Toolbar sx={{ padding: '10px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              Tienda Sol
            </Typography>
          </Link>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            {links.map((navLink) => (
              <Box
                key={navLink.link}
                component="a"
                href={navLink.link}
                sx={getLinkStyles(navLink.link)}
              >
                {navLink.name}
              </Box>
            ))}

            <IconButton aria-label="Notificaciones"
              component={NextLink}
              href="/notificaciones"
              sx={{
                backgroundColor: isNotifications ? 'white' : 'transparent'
              }}
            >
              <FiBell size={20} />
            </IconButton>

            <UsuarioMenu userType="seller" />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SellerNavbar;
