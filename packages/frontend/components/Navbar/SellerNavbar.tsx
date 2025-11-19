'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Badge from '@mui/material/Badge';
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
  useTheme,
  Link
} from '@mui/material';
import { FiBell, FiMenu } from 'react-icons/fi';
import NextLink from 'next/link';
import UsuarioMenu from '@/components/UsuarioMenu/usuarioMenu';
import NotificationPanel from '@/components/NotificationPanel/NotificationPanel'; // 👈 import panel

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  

  // ✅ estado para popup de notificaciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
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
      backgroundColor: pathname === path ? theme.palette.background.paper : 'rgba(252, 163, 17, 0.15)',
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
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1400px',
                mx: 'auto'
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* ✅ ícono de notificaciones con popup */}
                <IconButton
                  aria-label="Ver notificaciones"
                  title="Notificaciones"
                  onClick={handleNotifClick}
                >
                  <FiBell size={20} />
                </IconButton>
                <NotificationPanel anchorEl={anchorEl} onClose={handleNotifClose} />

                <UsuarioMenu userType="seller" />
              </Box>
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
                    role="link"
                    aria-label={`Ir a ${navLink.name}`}
                    sx={getLinkStyles(navLink.link)}
                  >
                    {navLink.name}
                  </Box>
                ))}

                {/* ✅ ícono de notificaciones con popup */}
                  <IconButton aria-label="Ver notificaciones" title="Notificaciones" onClick={handleNotifClick}>
                    <Badge badgeContent={unreadCount} color="error" overlap="circular" invisible={unreadCount === 0}>
                      <FiBell size={20} />
                    </Badge>
                  </IconButton>

                  <NotificationPanel
                    anchorEl={anchorEl}
                    onClose={handleNotifClose}
                    onUnreadCountChange={setUnreadCount} // 👈 recibimos el número
                  />

                <UsuarioMenu userType="seller" />
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

export default SellerNavbar;