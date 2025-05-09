import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/usuarios');
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        console.error('Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email || (!usuarioEdit && !password)) {
      alert('Nombre, correo y contraseña son obligatorios');
      return;
    }

    const usuario = {
      nombre,
      email,
      ...(password && { contra: password }),
    };

    try {
      let res;
      if (usuarioEdit) {
        res = await fetch(`http://localhost:3001/api/usuarios/${usuarioEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
      } else {
        res = await fetch('http://localhost:3001/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
      }

      if (res.ok) {
        alert(usuarioEdit ? 'Usuario actualizado' : 'Usuario agregado');
        setShowModal(false);
        setUsuarioEdit(null);
        obtenerUsuarios();
        setNombre('');
        setEmail('');
        setPassword('');
      } else {
        alert('Error al guardar usuario');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const res = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
          alert('Usuario eliminado');
        } else {
          alert('Error al eliminar usuario');
        }
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  const handleShowModal = (usuario = null) => {
    if (usuario) {
      setNombre(usuario.nombre);
      setEmail(usuario.email);
      setPassword('');
      setUsuarioEdit(usuario);
    } else {
      setNombre('');
      setEmail('');
      setPassword('');
      setUsuarioEdit(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioEdit(null);
    setNombre('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3>Gestión de Usuarios</h3>
        <Button className="mb-3" onClick={() => handleShowModal()}>
          Agregar Usuario
        </Button>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th style={{ width: '180px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleShowModal(usuario)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEdit ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={usuarioEdit ? 'Dejar en blanco para no cambiar' : ''}
                required={!usuarioEdit}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {usuarioEdit ? 'Actualizar Usuario' : 'Guardar Usuario'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Usuarios;
