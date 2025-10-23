'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { FiBell, FiUser } from 'react-icons/fi';

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
    { name: 'ADMINISTRAR PEDIDOS', link: '/admin-pedidos' },
    { name: 'MIS PRODUCTOS', link: '/mis-productos' }
  ]
}) => {
  const pathname = usePathname();

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

          {/* Logo/Nombre de la tienda */}
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 'bold' }}
          >
            Tienda Sol
          </Typography>

          {/* Enlaces específicos para el vendedor */}
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

            {/* Iconos - Solo notificaciones y usuario, NO carrito */}
            <IconButton aria-label="Notificaciones">
              <FiBell size={20} />
            </IconButton>

            <IconButton aria-label="Perfil de Usuario">
              <FiUser size={20} />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SellerNavbar;
