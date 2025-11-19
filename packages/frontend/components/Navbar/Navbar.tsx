'use client';
import React from 'react';
import BuyerNavbar from './BuyerNavbar';
import SellerNavbar from './SellerNavbar';
import { NavLink } from './BuyerNavbar';
import { Link, Box } from '@mui/material';

interface NavbarProps {
  userType: 'buyer' | 'seller';
  links?: NavLink[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  minimal?: boolean;
  onSearch?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  userType,
  links,
  showSearch,
  searchPlaceholder,
  minimal = false,
  onSearch,
}) => {
  // altura estándar del navbar (ajustá según tu diseño)
  const NAVBAR_HEIGHT = 64;

  if (minimal) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1200,
            backgroundColor: 'var(--oxford-blue)',
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 2 },
          }}
        >
          <Link
            href="/home"
            sx={{
              color: 'white',
              fontSize: { xs: '18px', md: '22px' },
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Tienda Sol
          </Link>
        </Box>
        {/* Espaciador invisible */}
        <Box sx={{ height: `${NAVBAR_HEIGHT}px` }} />
      </>
    );
  }

  const commonProps = {
    sx: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1200,
    },
  };

  const spacer = <Box sx={{ height: `${NAVBAR_HEIGHT}px` }} />;

  switch (userType) {
    case 'buyer':
      return (
        <>
          <Box {...commonProps}>
            <BuyerNavbar
              links={links}
              showSearch={showSearch}
              searchPlaceholder={searchPlaceholder}
              onSearch={onSearch}
            />
          </Box>
          {spacer}
        </>
      );
    case 'seller':
      return (
        <>
          <Box {...commonProps}>
            <SellerNavbar links={links} />
          </Box>
          {spacer}
        </>
      );
    default:
      console.warn(`Tipo de usuario desconocido: ${userType}. Mostrando Navbar del Comprador.`);
      return (
        <>
          <Box {...commonProps}>
            <BuyerNavbar
              links={links}
              showSearch={showSearch}
              searchPlaceholder={searchPlaceholder}
              onSearch={onSearch}
            />
          </Box>
          {spacer}
        </>
      );
  }
};

export default Navbar;