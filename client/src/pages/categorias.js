import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import NavBar from '../components/Navbar';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar las categorías:', err);
    }
  };

  const handleShowModal = (categoria = null) => {
    setCategoriaEdit(categoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCategoriaEdit(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, descrip } = e.target.elements;

    const data = {
      nombre: nombre.value,
      descrip: descrip.value
    };

    try {
      const url = categoriaEdit
        ? `http://localhost:3001/api/categorias/${categoriaEdit.id}`
        : 'http://localhost:3001/api/categorias';

      const method = categoriaEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        handleCloseModal();
        fetchCategorias();
      } else {
        alert('Error al guardar la categoría');
      }
    } catch (err) {
      console.error('Error al guardar categoría:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/categorias/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCategorias();
      } else {
        alert('Error al eliminar la categoría');
      }
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3 className="mb-4">Categorías</h3>
        <Button className="mb-3" onClick={() => handleShowModal()}>Agregar Categoría</Button>
        <Table bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.nombre}</td>
                <td>{cat.descrip}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleShowModal(cat)}>Editar</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{categoriaEdit ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                defaultValue={categoriaEdit?.nombre || ''}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descrip"
                defaultValue={categoriaEdit?.descrip || ''}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" type="submit">
              {categoriaEdit ? 'Actualizar' : 'Agregar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Categorias;
