import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge } from 'react-bootstrap';
import NavBar from '../components/Navbar';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('http://localhost:3001/api/productos'),
          fetch('http://localhost:3001/api/categorias'),
        ]);
        const productosData = await prodRes.json();
        const categoriasData = await catRes.json();

        const productosValidos = productosData.filter(producto => 
          producto.nombre && producto.precio && producto.stock !== undefined && producto.min_stock !== undefined
        );

        setProductos(productosValidos);
        setCategorias(categoriasData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = (producto = null) => {
    setProductoEdit(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setProductoEdit(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, precio, stock, min_stock, category_id } = e.target.elements;
    
    if (!nombre.value || !precio.value || !stock.value || !min_stock.value || !category_id.value) {
      alert('Todos los campos son requeridos.');
      return;
    }

    const productoData = {
      nombre: nombre.value,
      precio: parseFloat(precio.value),
      stock: parseInt(stock.value),
      min_stock: parseInt(min_stock.value),
      category_id: parseInt(category_id.value),
    };

    try {
      const url = productoEdit
        ? `http://localhost:3001/api/productos/${productoEdit.id}`
        : 'http://localhost:3001/api/productos';
      const method = productoEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
      });

      if (res.ok) {
        alert('Producto guardado exitosamente');
        const data = await res.json();
        if (productoEdit) {
          setProductos(productos.map(p => (p.id === productoEdit.id ? data : p)));
        } else {
          setProductos([...productos, data]);
        }
        handleCloseModal();
      } else {
        alert('Error al guardar el producto');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar este producto?')) {
      try {
        const res = await fetch(`http://localhost:3001/api/productos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProductos(productos.filter(p => p.id !== id));
          alert('Producto eliminado');
        } else {
          alert('Error al eliminar');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const getNombreCategoria = (id) => {
    const categoria = categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const productosFiltrados = productos.filter((producto) => {
    const nombreValido = producto.nombre || '';
    const coincideNombre = nombreValido.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideCategoria = filtroCategoria === '' || producto.category_id === parseInt(filtroCategoria);
    return coincideNombre && coincideCategoria;
  });

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3>Inventario de Productos</h3>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button onClick={() => handleShowModal()}>Agregar Producto</Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>S/. {Number(producto.precio).toFixed(2)}</td>
                <td>
                  <Badge bg={producto.stock <= producto.min_stock ? 'danger' : 'success'}>
                    {producto.stock}
                  </Badge>
                </td>
                <td>{producto.min_stock}</td>
                <td>{getNombreCategoria(producto.category_id)}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => handleShowModal(producto)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(producto.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{productoEdit ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" defaultValue={productoEdit?.nombre || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio (S/.)</Form.Label>
              <Form.Control name="precio" type="number" step="0.01" defaultValue={productoEdit?.precio || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control name="stock" type="number" defaultValue={productoEdit?.stock || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Mínimo</Form.Label>
              <Form.Control name="min_stock" type="number" defaultValue={productoEdit?.min_stock || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="category_id" defaultValue={productoEdit?.category_id || ''} required>
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {productoEdit ? 'Actualizar' : 'Agregar'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Productos;
