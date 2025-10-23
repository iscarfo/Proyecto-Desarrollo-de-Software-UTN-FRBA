import React, { useState } from 'react';
// Importamos Router, Routes y Route
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import OrdersPage from './pages/OrdersPage'; // Importamos la nueva página de pedidos
import './App.css'; 

/**
 * Componente que define el layout principal (Navbar, Rutas, Footer).
 * Recibe el tipo de usuario y maneja la navegación.
 */
const Layout = ({ userType, toggleUserType }) => {
  const isBuyer = userType === 'buyer';

  return (
    // Aplicamos la clase App-Layout para el Sticky Footer (definida en App.css)
    <div className="App-Layout">
      {/* 1. Navbar (Cambia según el userType) */}
      <Navbar userType={userType} />
      
      {/* 2. Contenido principal con las rutas */}
      <main className="App-Content">
        <Routes>
          {/* Rutas de Comprador */}
          {isBuyer && (
            <>
              {/* Ruta /home del Comprador */}
              <Route path="/home" element={
                <div style={{ textAlign: 'center' }}>
                  <h1>Home Comprador</h1>
                  <p>Actualmente estás viendo la interfaz como: <strong>{userType.toUpperCase()}</strong></p>
                  <button onClick={toggleUserType} style={{ padding: '10px', marginTop: '20px' }}>
                    Cambiar a vista de Vendedor
                  </button>
                </div>
              } />
              {/* Ruta /mis-pedidos del Comprador */}
              <Route path="/mis-pedidos" element={<OrdersPage userType="buyer" />} />
            </>
          )}

          {/* Rutas de Vendedor */}
          {!isBuyer && (
            <>
              {/* Ruta /home del Vendedor */}
              <Route path="/home" element={
                <div style={{ textAlign: 'center' }}>
                  <h1>Home Vendedor</h1>
                  <p>Actualmente estás viendo la interfaz como: <strong>{userType.toUpperCase()}</strong></p>
                  <button onClick={toggleUserType} style={{ padding: '10px', marginTop: '20px' }}>
                    Cambiar a vista de Comprador
                  </button>
                </div>
              } />
              {/* Ruta /admin-pedidos del Vendedor */}
              <Route path="/admin-pedidos" element={<OrdersPage userType="seller" />} />
              {/* Ruta /mis-productos del Vendedor */}
              <Route path="/mis-productos" element={<h1>Mis Productos (Vendedor)</h1>} />
            </>
          )}
          
          {/* Ruta por defecto (Redirige a /home) */}
          <Route path="/" element={<p>Cargando...</p>} />
          <Route path="*" element={<h1>Página no encontrada (404)</h1>} />
        </Routes>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};


function App() {
  // Estado para el tipo de usuario (usamos 'buyer' por defecto)
  const [currentUserType, setCurrentUserType] = useState('buyer'); 

  // Función para cambiar de tipo de usuario
  const toggleUserType = () => {
    setCurrentUserType(prevType => 
      prevType === 'buyer' ? 'seller' : 'buyer'
    );
  };
  
  return (
    // Envolvemos toda la aplicación en el Router
    <Router> 
      <Layout userType={currentUserType} toggleUserType={toggleUserType} />
    </Router>
  );
}

export default App;
