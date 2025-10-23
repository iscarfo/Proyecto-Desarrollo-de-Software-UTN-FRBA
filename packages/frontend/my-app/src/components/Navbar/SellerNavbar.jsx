import React from 'react';
import { FiBell, FiUser } from 'react-icons/fi';
import './Navbar.css';

const SellerNavbar = () => {
  return (
    <nav className="navbar seller-navbar">
      <div className="navbar-container">
        
        {/* Logo/Nombre de la tienda */}
        <div className="navbar-brand">
          <span className="logo-text">Tienda Sol</span>
        </div>
        
        {/* Los vendedores no tienen búsqueda en el mock-up, así que el espacio se ajusta con CSS */}

        {/* Enlaces específicos para el vendedor */}
        <div className="navbar-links">
          <a href="/home" className="nav-link home-link">HOME</a>
          <a href="/admin-pedidos" className="nav-link">ADMINISTRAR PEDIDOS</a>
          <a href="/mis-productos" className="nav-link">MIS PRODUCTOS</a>
          
          {/* Ícono de Notificaciones */}
          <button className="nav-icon-btn" aria-label="Notificaciones">
            <FiBell size={20} />
          </button>
          {/* Ícono de Perfil de Usuario */}
          <button className="nav-icon-btn" aria-label="Perfil de Usuario">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;