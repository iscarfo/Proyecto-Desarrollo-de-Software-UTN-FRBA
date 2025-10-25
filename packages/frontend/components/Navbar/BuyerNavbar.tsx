'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, TextField, IconButton, InputAdornment, Box } from '@mui/material';
import { FiShoppingCart, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import NextLink from 'next/link';

export interface NavLink {
  name: string;
  link: string;
}

interface BuyerNavbarProps {
  links?: NavLink[];
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const BuyerNavbar: React.FC<BuyerNavbarProps> = ({
  links = [
    { name: 'HOME', link: '/' },
    { name: 'MIS PEDIDOS', link: '/mis-pedidos' },
  ],
  showSearch = true,
  searchPlaceholder = 'Buscar productos, marcas y más...'
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

          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 'bold', marginRight: '24px' }}
          >
            Tienda Sol
          </Typography>

          {showSearch && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              variant="outlined"
              sx={{
                width: '380px',
                backgroundColor: 'background.paper',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '8px 12px',
                  fontSize: '14px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch size={18} style={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

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
                backgroundColor: isNotifications ? 'primary.main' : 'transparent'
              }}
            >
              <FiBell size={20} />
            </IconButton>

            <IconButton aria-label="Carrito de compras">
              <FiShoppingCart size={20} />
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

export default BuyerNavbar;
