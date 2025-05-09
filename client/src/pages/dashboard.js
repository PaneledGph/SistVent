import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar';

const Dashboard = () => {
  const modules = [
    { title: 'Inventario', description: 'Gestiona productos y stock', link: '/productos' },
    { title: 'Venta', description: 'Registra y consulta ventas', link: '/venta' },
    { title: 'Clientes', description: 'Atiende clientes y consulta historial', link: '/clientes' },
    { title: 'Historial', description: 'Visualiza reportes y estadísticas', link: '/ventas' }
  ];

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <h2 className="mb-4 text-center">Nova Salud</h2>
        <Row>
          {modules.map((module, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="h-100 shadow">
                <Card.Body>
                  <Card.Title>{module.title}</Card.Title>
                  <Card.Text>{module.description}</Card.Text>
                  <Link to={module.link}>
                    <Button variant="primary">
                      Ir a {module.title}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
