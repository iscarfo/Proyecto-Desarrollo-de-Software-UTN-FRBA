import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
// Importa otros estilos globales si los tienes
import './App.css'; 

function App() {
  // -----------------------------------------------------------
  // SIMULACIÓN DE AUTENTICACIÓN: 
  // En tu aplicación real, esta variable vendría de tu lógica de login.
  // -----------------------------------------------------------
  const [currentUserType, setCurrentUserType] = useState('buyer'); 
  // const [currentUserType, setCurrentUserType] = useState('seller'); // Descomenta esta línea para probar el vendedor

  // Función de prueba para cambiar de tipo de usuario
  const toggleUserType = () => {
    setCurrentUserType(prevType => 
      prevType === 'buyer' ? 'seller' : 'buyer'
    );
  };

  return (
    <div className="App">
      {/* 1. Usar el componente Navbar */}
      <Navbar userType={currentUserType} />
      
      {/* 2. Contenido principal (placeholder) */}
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Contenido Principal de la Aplicación</h1>
        <p>Actualmente estás viendo la interfaz como: <strong>{currentUserType.toUpperCase()}</strong></p>
        
        {/* Botón de prueba (opcional) */}
        <button onClick={toggleUserType} style={{ padding: '10px', marginTop: '20px' }}>
          Cambiar a vista de {currentUserType === 'buyer' ? 'Vendedor' : 'Comprador'}
        </button>
      </main>

      <Footer />
    </div>
  );
}

export default App;
