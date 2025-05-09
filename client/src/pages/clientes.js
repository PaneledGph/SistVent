import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clienteFormData, setClienteFormData] = useState({ id: '', nombre: '', telefono: '', email: '', direc: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/clientes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error("Error al obtener los clientes: ", data);
        }
      })
      .catch((err) => {
        console.error("Error al obtener clientes: ", err);
      });
  }, []);

  const handleEliminarCliente = (id) => {
    fetch(`http://localhost:3001/api/clientes/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setClientes(clientes.filter(cliente => cliente.id !== id));
      })
      .catch((err) => {
        alert('Error al eliminar cliente');
        console.error('Error al eliminar cliente:', err);
      });
  };

  const handleMostrarModal = (cliente = null) => {
    if (cliente) {
      setClienteFormData(cliente);
      setIsEditMode(true);
    } else {
      setClienteFormData({ id: '', nombre: '', telefono: '', email: '', direc: '' });
      setIsEditMode(false);
    }
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, telefono, email, direc } = clienteFormData;

    if (!nombre || !telefono || !email || !direc) {
      alert('Por favor, complete todos los campos');
      return;
    }

    const url = isEditMode
      ? `http://localhost:3001/api/clientes/${clienteFormData.id}`
      : 'http://localhost:3001/api/clientes';

    const method = isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteFormData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isEditMode) {
          setClientes(clientes.map((cliente) => (cliente.id === data.id ? data : cliente)));
        } else {
          setClientes([...clientes, data]);
        }
        setShowModal(false);
        alert(isEditMode ? 'Cliente actualizado correctamente' : 'Cliente agregado correctamente');
      })
      .catch((err) => {
        alert('Error al guardar el cliente');
        console.error('Error al guardar el cliente:', err);
      });
  };

  const handleChange = (e) => {
    setClienteFormData({
      ...clienteFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3>Gestión de Clientes</h3>
        <Button className="mb-3" onClick={() => handleMostrarModal()}>
          Agregar Cliente
        </Button>
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td>{cliente.direc}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleMostrarModal(cliente)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleEliminarCliente(cliente.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={clienteFormData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={clienteFormData.telefono}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={clienteFormData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direc"
                value={clienteFormData.direc}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Clientes;
