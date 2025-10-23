'use client';
import React from 'react';
import BuyerNavbar from './BuyerNavbar';
import SellerNavbar from './SellerNavbar';
import { NavLink } from './BuyerNavbar';

interface NavbarProps {
  userType: 'buyer' | 'seller';
  links?: NavLink[];
  showSearch?: boolean;
  searchPlaceholder?: string;
}

/**
 * Componente de barra de navegación principal.
 * Renderiza la versión para comprador o vendedor según el 'userType'.
 *
 * @param {string} userType - Debe ser 'buyer' o 'seller'.
 * @param {NavLink[]} links - Array de objetos con { name: string, link: string }
 * @param {boolean} showSearch - Mostrar barra de búsqueda (solo para buyer)
 * @param {string} searchPlaceholder - Placeholder de la barra de búsqueda
 *
 * @example
 * // Buyer con links personalizados
 * <Navbar
 *   userType="buyer"
 *   links={[
 *     { name: 'HOME', link: '/' },
 *     { name: 'MIS PEDIDOS', link: '/mis-pedidos' }
 *   ]}
 * />
 *
 * @example
 * // Seller con links personalizados
 * <Navbar
 *   userType="seller"
 *   links={[
 *     { name: 'HOME', link: '/seller' },
 *     { name: 'PEDIDOS', link: '/admin-pedidos' }
 *   ]}
 * />
 */
const Navbar: React.FC<NavbarProps> = ({ userType, links, showSearch, searchPlaceholder }) => {
  switch (userType) {
    case 'buyer':
      return (
        <BuyerNavbar
          links={links}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
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
        />
      );
  }
};

export default Navbar;
