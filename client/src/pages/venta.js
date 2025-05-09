import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Card } from 'react-bootstrap';
import NavBar from '../components/Navbar';

const Venta = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [venta, setVenta] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState(0);
  const [usuarioId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showClienteModal, setShowClienteModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('categoria', selectedCategory);
    if (searchQuery) params.append('search', searchQuery);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0]);
    if (priceRange[1] < 1000) params.append('maxPrice', priceRange[1]);

    fetch(`http://localhost:3001/api/productos?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("La respuesta de productos no es un array:", data);
        }
      })
      .catch(err => console.error('Error al obtener productos:', err));
    
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.error("La respuesta de categorías no es un array:", data);
        }
      })
      .catch(err => console.error('Error al obtener categorías:', err));

    fetch('http://localhost:3001/api/clientes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error("La respuesta de clientes no es un array:", data);
        }
      })
      .catch(err => console.error('Error al obtener clientes:', err));
  }, [searchQuery, selectedCategory, priceRange]);

  const agregarProducto = (producto) => {
    if (!producto || !producto.nombre) {
      alert('Producto inválido');
      return;
    }
  
    if (producto.stock <= 0) {
      alert(`El producto "${producto.nombre}" no tiene stock disponible.`);
      return;
    }
  
    const existe = venta.find(p => p.id === producto.id);
    const cantidadEnCarrito = existe ? existe.cantidad : 0;
  
    if (cantidadEnCarrito >= producto.stock) {
      alert(`Ya no hay más stock disponible para "${producto.nombre}".`);
      return;
    }
  
    if (producto.stock <= producto.stock_min) {
      if (!window.confirm(`El producto "${producto.nombre}" tiene poco stock (actual: ${producto.stock}, mínimo: ${producto.stock_min}). ¿Deseas agregarlo igual?`)) {
        return;
      }
    }
  
    if (existe) {
      setVenta(venta.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setVenta([...venta, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProducto = (id) => {
    setVenta(venta.filter(p => p.id !== id));
  };

  const totalVenta = venta.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

  const registrarVenta = () => {
    fetch('http://localhost:3001/api/venta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: usuarioId,
        cliente_id: clienteId || null,
        productos: venta
      })
    })
    .then(res => res.json())
    .then(data => {
      alert('Venta registrada correctamente');
      setVenta([]);
      setClienteId(0);
    })
    .catch(err => alert('Error al registrar venta'));
  };

  const handleRegistrarCliente = async (e) => {
    e.preventDefault();
    const { nombre, telefono, email, direc } = e.target.elements;

    const nuevoCliente = {
      nombre: nombre.value,
      telefono: telefono.value,
      email: email.value,
      direc: direc.value,
    };

    try {
      const res = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente),
      });

      if (res.ok) {
        const clienteGuardado = await res.json();
        setClientes(prev => [...prev, clienteGuardado]);
        setClienteId(clienteGuardado.id);
        setShowClienteModal(false);
      } else {
        alert('Error al registrar el cliente');
      }
    } catch (error) {
      console.error('Error registrando cliente:', error);
    }
  };

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h3 className="mb-4">Registrar Venta</h3>

        <Row className="mb-4">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  value={clienteId}
                  onChange={(e) => setClienteId(parseInt(e.target.value))}
                  style={{ maxWidth: '300px' }}
                >
                  <option value={0}>Venta rápida</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Form.Select>
                <Button variant="secondary" onClick={() => setShowClienteModal(true)}>Nuevo Cliente</Button>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Buscar Producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Rango de Precio</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  min={0}
                />
                <span>-</span>
                <Form.Control
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  min={0}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Table bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Agregar</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map(p => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>S/ {p.precio}</td>
                      <td>{p.stock}</td>
                      <td><Button variant="primary" onClick={() => agregarProducto(p)}>+</Button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No se encontraron productos</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={8}>
            <Card>
              <Card.Header><h4>Detalle de Venta</h4></Card.Header>
              <Card.Body>
                <Table bordered hover>
                  <thead className="table-dark">
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venta.map(p => (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td>{p.cantidad}</td>
                        <td>S/ {p.precio * p.cantidad}</td>
                        <td><Button variant="danger" onClick={() => quitarProducto(p.id)}>-</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between">
                  <h4>Total: S/ {totalVenta}</h4>
                  <Button variant="success" onClick={registrarVenta}>Registrar Venta</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal de Registro de Cliente */}
        <Modal show={showClienteModal} onHide={() => setShowClienteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Registrar Cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleRegistrarCliente}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" />
              </Form.Group>
              <Form.Group controlId="direc">
                <Form.Label>Dirección</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" onClick={() => setShowClienteModal(false)}>Cancelar</Button>
                <Button type="submit" variant="primary" className="ml-2">Registrar</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Venta;
