'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FiShoppingCart, FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import NextLink from 'next/link';
import { Link } from '@mui/material';
import UsuarioMenu from '@/components/UsuarioMenu/usuarioMenu';

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
    { name: 'HOME', link: '/home' },
    { name: 'MIS PEDIDOS', link: '/mis-pedidos' },
  ],
  showSearch = true,
  searchPlaceholder = 'Buscar productos, marcas y más...'
}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:980px)');
  const isNotifications = pathname === '/notificaciones';
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

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
    <>
      <AppBar position="static" role="navigation">
        <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
          {isMobile ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '1400px',
                mx: 'auto',
                gap: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <IconButton
                  aria-label="Abrir menú de navegación"
                  title="Menú"
                  onClick={toggleDrawer(true)}
                >
                  <FiMenu size={22} />
                </IconButton>

                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Link href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: 'bold', fontSize: '20px' }}
                    >
                      Tienda Sol
                    </Typography>
                  </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    aria-label="Ver notificaciones"
                    title="Notificaciones"
                    component={NextLink}
                    href="/notificaciones"
                    sx={{ backgroundColor: isNotifications ? 'primary.main' : 'transparent' }}
                  >
                    <FiBell size={20} />
                  </IconButton>

                  <IconButton
                    aria-label="Ver carrito de compras"
                    title="Carrito"
                    component={NextLink}
                    href="/carrito"
                    sx={{ backgroundColor: isNotifications ? 'primary.main' : 'transparent' }}
                  >
                    <FiShoppingCart size={20} />
                  </IconButton>

                  <UsuarioMenu userType="buyer" />
                </Box>
              </Box>

              {showSearch && (
                <TextField
                  size="small"
                  placeholder={searchPlaceholder}
                  variant="outlined"
                  fullWidth
                  aria-label="Buscar productos, marcas y más"
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: 'transparent' },
                      '&.Mui-focused fieldset': { borderColor: 'transparent' },
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
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1400px',
                mx: 'auto'
              }}
            >
              <Link href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 'bold', marginRight: '24px' }}
                >
                  Tienda Sol
                </Typography>
              </Link>

              {showSearch && (
                <TextField
                  size="small"
                  placeholder={searchPlaceholder}
                  variant="outlined"
                  aria-label="Buscar productos, marcas y más"
                  sx={{
                    width: '380px',
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: 'transparent' },
                      '&.Mui-focused fieldset': { borderColor: 'transparent' },
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
                    role="link"
                    aria-label={`Ir a ${navLink.name}`}
                    sx={getLinkStyles(navLink.link)}
                  >
                    {navLink.name}
                  </Box>
                ))}

                <IconButton
                  aria-label="Ver notificaciones"
                  title="Notificaciones"
                  component={NextLink}
                  href="/notificaciones"
                  sx={{ backgroundColor: isNotifications ? 'primary.main' : 'transparent' }}
                >
                  <FiBell size={20} />
                </IconButton>

                <IconButton
                  aria-label="Ver carrito de compras"
                  title="Carrito"
                  component={NextLink}
                  href="/carrito"
                  sx={{ backgroundColor: isNotifications ? 'primary.main' : 'transparent' }}
                >
                  <FiShoppingCart size={20} />
                </IconButton>

                <UsuarioMenu userType="buyer" />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} aria-label="Menú de navegación móvil">
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {links.map((navLink) => (
              <ListItem key={navLink.link} disablePadding role="listitem">
                <ListItemButton component={NextLink} href={navLink.link}>
                  <ListItemText primary={navLink.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default BuyerNavbar;