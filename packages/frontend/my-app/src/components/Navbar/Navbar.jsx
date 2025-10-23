import React from 'react';
import BuyerNavbar from './BuyerNavbar';
import SellerNavbar from './SellerNavbar';
import './Navbar.css'; // Importa los estilos compartidos y específicos

/**
 * Componente de barra de navegación principal.
 * Renderiza la versión para comprador o vendedor según el 'userType'.
 * * @param {string} userType - Debe ser 'buyer' o 'seller'.
 * @param {object} props
 */
const Navbar = ({ userType, ...props }) => {
  // Manejo de qué componente renderizar
  switch (userType) {
    case 'buyer':
      return <BuyerNavbar {...props} />;
    case 'seller':
      return <SellerNavbar {...props} />;
    default:
      // Fallback: Si el userType no es válido, mostramos la versión de comprador
      console.warn(`Tipo de usuario desconocido: ${userType}. Mostrando Navbar del Comprador.`);
      return <BuyerNavbar {...props} />; 
  }
};

export default Navbar;