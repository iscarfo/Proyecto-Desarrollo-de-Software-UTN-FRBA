import React from 'react';
// Añadimos FiUser para el perfil
import { FiShoppingCart, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import './Navbar.css';

const BuyerNavbar = () => {
  return (
    <nav className="navbar buyer-navbar">
      <div className="navbar-container">
        
        {/* Logo/Nombre de la tienda */}
        <div className="navbar-brand">
          <span className="logo-text">Tienda Sol</span>
        </div>
        
        {/* Búsqueda */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar productos, marcas, ofertas..."
            className="search-input"
          />
          <FiSearch className="search-icon" /> 
        </div>

        {/* Enlaces y botones */}
        <div className="navbar-links">
          <a href="/home" className="nav-link home-link">HOME</a>
          <a href="/mis-pedidos" className="nav-link">MIS PEDIDOS</a>
          
          {/* Ícono de Notificaciones */}
          <button className="nav-icon-btn" aria-label="Notificaciones">
            <FiBell size={20} />
          </button>
          {/* Ícono de Carrito de compras */}
          <button className="nav-icon-btn" aria-label="Carrito de compras">
            <FiShoppingCart size={20} />
          </button>
          {/* Ícono de Perfil de Usuario (¡Agregado!) */}
          <button className="nav-icon-btn" aria-label="Perfil de Usuario">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;