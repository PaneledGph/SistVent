import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#34495e' }} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: '500', fontSize: '1.5rem', color: '#ecf0f1' }}>
          Nova Salud
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/" style={{ color: '#ecf0f1', margin: '0 15px' }}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos" style={{ color: '#ecf0f1', margin: '0 15px' }}>Inventario</Nav.Link>
            <Nav.Link as={Link} to="/categorias" style={{ color: '#ecf0f1', margin: '0 15px' }}>Categorías</Nav.Link>
            <Nav.Link as={Link} to="/venta" style={{ color: '#ecf0f1', margin: '0 15px' }}>Venta</Nav.Link>
            <Nav.Link as={Link} to="/ventas" style={{ color: '#ecf0f1', margin: '0 15px' }}>Historial</Nav.Link>
            <Nav.Link as={Link} to="/clientes" style={{ color: '#ecf0f1', margin: '0 15px' }}>Clientes</Nav.Link>
            <Nav.Link as={Link} to="/usuarios" style={{ color: '#ecf0f1', margin: '0 15px' }}>Usuarios</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout} style={{ border: 'none', padding: '5px 15px', fontSize: '0.9rem' }}>
            <BoxArrowRight className="me-2" />
            Cerrar Sesión
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
