import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Productos from './pages/productos';
import Categorias from './pages/categorias';
import Clientes from './pages/clientes';
import Venta from './pages/venta';
import HistorialVentas from './pages/ventas';
import Usuarios from './pages/usuarios';
import Login from './pages/login';
import Navbar from './components/Navbar'; // Asegúrate de crear este componente (ver abajo)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/productos" element={isAuthenticated ? <Productos /> : <Navigate to="/login" />} />
        <Route path="/categorias" element={isAuthenticated ? <Categorias /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />} />
        <Route path="/venta" element={isAuthenticated ? <Venta /> : <Navigate to="/login" />} />
        <Route path="/ventas" element={isAuthenticated ? <HistorialVentas /> : <Navigate to="/login" />} />
        <Route path="/usuarios" element={isAuthenticated ? <Usuarios /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
