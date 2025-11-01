'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { FiBell, FiMenu } from 'react-icons/fi';
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
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
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
      <AppBar position="static">
        <Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
          {isMobile ? (
            // 📱 Mobile layout
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
              {/* Left: Hamburguesa */}
              <IconButton onClick={toggleDrawer(true)}>
                <FiMenu size={22} />
              </IconButton>

              {/* Center: Logo */}
              <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 'bold', fontSize: '20px' }}
                  >
                    Tienda Sol
                  </Typography>
                </Link>
              </Box>

              {/* Right: Íconos */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  aria-label="Notificaciones"
                  component={NextLink}
                  href="/notificaciones"
                  sx={{ backgroundColor: isNotifications ? 'primary.main' : 'transparent' }}
                >
                  <FiBell size={20} />
                </IconButton>

                <UsuarioMenu userType="seller" />
              </Box>
            </Box>
          ) : (
            // 💻 Desktop layout (tu versión original)
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
              {/* Logo */}
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 'bold' }}
                >
                  Tienda Sol
                </Typography>
              </Link>

              {/* Links + Íconos */}
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

                <IconButton
                  aria-label="Notificaciones"
                  component={NextLink}
                  href="/notificaciones"
                  sx={{ backgroundColor: isNotifications ? 'white' : 'transparent' }}
                >
                  <FiBell size={20} />
                </IconButton>

                <UsuarioMenu userType="seller" />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer para móviles */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
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

export default SellerNavbar;