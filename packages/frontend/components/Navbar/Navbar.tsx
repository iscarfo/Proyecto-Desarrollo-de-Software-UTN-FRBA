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
  if (minimal) {
    return (
      <Box
        sx={{
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
    );
  }

  switch (userType) {
    case 'buyer':
      return (
        <BuyerNavbar
          links={links}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
      );
    case 'seller':
      return <SellerNavbar links={links} />;
    default:
      console.warn(`Tipo de usuario desconocido: ${userType}. Mostrando Navbar del Comprador.`);
      return (
        <BuyerNavbar
          links={links}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
      );
  }
};

export default Navbar;
