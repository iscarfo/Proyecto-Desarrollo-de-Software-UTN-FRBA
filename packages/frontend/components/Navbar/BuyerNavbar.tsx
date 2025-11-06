'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Badge from '@mui/material/Badge';
import { useCart } from '../../src/store/CartContext';
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
  useTheme,
  Link
} from '@mui/material';
import { FiShoppingCart, FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import NextLink from 'next/link';
import UsuarioMenu from '@/components/UsuarioMenu/usuarioMenu';

export interface NavLink {
  name: string;
  link: string;
}

interface BuyerNavbarProps {
  links?: NavLink[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (text: string) => void;
}

const BuyerNavbar: React.FC<BuyerNavbarProps> = ({
  links = [
    { name: 'HOME', link: '/home' },
    { name: 'MIS PEDIDOS', link: '/mis-pedidos' },
  ],
  showSearch = true,
  searchPlaceholder = 'Buscar productos, marcas y más...',
  onSearch
}) => {
  const pathname = usePathname();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:980px)');
  const isNotifications = pathname === '/notificaciones';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const { totalItems } = useCart();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchText.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/products');
    }
  };

  const getLinkStyles = (path: string) => ({
    color: pathname === path ? theme.palette.primary.main : 'inherit',
    backgroundColor: pathname === path ? theme.palette.background.paper : 'transparent',
    textDecoration: 'none',
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: 400,
    borderRadius: 1,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor:
        pathname === path ? theme.palette.background.paper : 'rgba(252, 163, 17, 0.15)',
    },
  });

  const SearchField = (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{ width: isMobile ? '100%' : '380px' }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={searchPlaceholder}
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
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
              <IconButton type="submit" aria-label="Buscar">
                <FiSearch size={18} style={{ color: '#666' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  return (
    <>
      <AppBar position="static" role="navigation" color="inherit" elevation={1}>
        <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
          {isMobile ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '1400px',
                mx: 'auto',
                gap: 1,
              }}
            >
              {/* Header superior móvil */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
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
                    sx={{
                      backgroundColor: isNotifications ? 'primary.main' : 'transparent',
                    }}
                  >
                    <FiBell size={20} />
                  </IconButton>

                  <IconButton
                  aria-label="Ver carrito"
                  component={NextLink}
                  href="/carrito"
                  >
                  <Badge
                  badgeContent={totalItems}
                  color="error"
                  overlap="circular"
                  invisible={totalItems === 0}
  >
                  <FiShoppingCart size={20} />
                </Badge>
                </IconButton>

                  <UsuarioMenu userType="buyer" />
                </Box>
              </Box>

              {/* Barra de búsqueda móvil */}
              {showSearch && SearchField}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1400px',
                mx: 'auto',
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

              {showSearch && SearchField}

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
                  aria-label="Ver carrito"
                  component={NextLink}
                  href="/carrito"
                  >
                  <Badge
                  badgeContent={totalItems}
                  color="error"
                  overlap="circular"
                  invisible={totalItems === 0}
  >
                  <FiShoppingCart size={20} />
                </Badge>
                </IconButton>

                <UsuarioMenu userType="buyer" />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer lateral móvil */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        aria-label="Menú de navegación móvil"
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {links.map((navLink) => (
              <ListItem key={navLink.link} disablePadding>
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
