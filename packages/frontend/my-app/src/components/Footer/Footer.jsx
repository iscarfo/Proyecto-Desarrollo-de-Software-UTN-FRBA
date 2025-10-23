import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa'; 
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content-wrapper"> {/* Nuevo wrapper para el contenido superior */}
        
        {/* Sección de Logo y Redes Sociales (Izquierda) */}
        <div className="footer-left-section">
          <h3 className="footer-logo">Tienda Sol</h3>
          <p className="social-label">Redes sociales</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FiFacebook size={24} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaTiktok size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FiTwitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FiInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Sección de Suscripción (Derecha) */}
        <div className="footer-right-section">
          <p className="subscribe-label">SUBSCRIBITE</p>
          <form className="subscription-form">
            <input
              type="email"
              placeholder="Ingresa tu mail"
              className="subscribe-input"
              aria-label="Ingresa tu mail para suscribirte"
            />
            <button type="submit" className="subscribe-button">
              Enviar
            </button>
          </form>
        </div>
      </div>

      {/* Franja de Copyright - ahora dentro del contenedor principal y centrado */}
      <div className="footer-copyright">
        <p>
          © 2025 Tienda sol — Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;