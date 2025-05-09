import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import NavBar from '../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchVentas = async () => {
    try {
      let url = 'http://localhost:3001/api/ventas';
      if (fechaInicio && fechaFin) {
        url += `?inicio=${fechaInicio}&fin=${fechaFin}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error('Error al cargar las ventas:', err);
    }
  };

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        let url = 'http://localhost:3001/api/ventas';
        if (fechaInicio && fechaFin) {
          url += `?inicio=${fechaInicio}&fin=${fechaFin}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setVentas(data);
      } catch (err) {
        console.error('Error al cargar las ventas:', err);
      }
    };
  
    fetchVentas();
  }, [fechaInicio, fechaFin]);

  const handleFiltrar = () => {
    if (fechaInicio && fechaFin) {
      fetchVentas();
    }
  };

  const fetchDetallesVenta = async (ventaId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/ventas/detalle/${ventaId}`);
      const data = await res.json();
      setDetallesVenta(data);
      setVentaSeleccionada(ventaId);
    } catch (err) {
      console.error('Error al cargar los detalles de la venta:', err);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
  
    const venta = ventas.find((v) => v.id === ventaSeleccionada);
    if (!venta) return;
  
    doc.setFontSize(16);
    doc.text('BOTICA NOVA SALUD', 14, 15);
    doc.setFontSize(10);
    doc.text('RUC: 12345678900', 14, 21);
    doc.text('Dirección: Av. Ejemplo 123, Ciudad', 14, 26);
    doc.text(`Fecha: ${new Date(venta.sale_date).toLocaleDateString()}`, 14, 31);
  
    doc.text(`Cliente: ${venta.cliente_nombre || 'Venta rápida'}`, 14, 38);
    doc.text(`Vendedor: ${venta.vendedor_nombre}`, 14, 43);
  
    const startY = 50;
    const tableData = detallesVenta.map((detalle) => ([
      detalle.producto_nombre,
      detalle.cantidad.toString(),
      'S/. ' + Number(detalle.precio_unitario).toFixed(2),
      'S/. ' + (detalle.cantidad * Number(detalle.precio_unitario)).toFixed(2),
    ]));
  
    doc.autoTable({
      startY,
      head: [['Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
      body: tableData,
      styles: { fontSize: 10 },
    });
  
    const total = detallesVenta.reduce((sum, d) => sum + d.cantidad * Number(d.precio_unitario), 0);
    const afterTableY = doc.autoTable.previous.finalY || 90;
  
    doc.setFontSize(12);
    doc.text(`Total: S/. ${total.toFixed(2)}`, 150, afterTableY + 10);
  
    window.open(doc.output('bloburl'), '_blank');
  };  

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h3>Historial de Ventas</h3>

        <Form className="mb-4">
          <Row>
            <Col md={4}>
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleFiltrar}>
                Filtrar
              </Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Vendedor</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{new Date(venta.sale_date).toLocaleDateString()}</td>
                <td>{venta.cliente_nombre || 'Venta rápida'}</td>
                <td>S/. {Number(venta.total).toFixed(2)}</td>
                <td>{venta.vendedor_nombre}</td>
                <td>
                  <Button variant="info" onClick={() => fetchDetallesVenta(venta.id)}>
                    Ver Detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {ventaSeleccionada && (
          <div className="mt-4">
            <h4>Detalles de la Venta</h4>
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                </tr>
              </thead>
              <tbody>
                {detallesVenta.map((detalle) => (
                  <tr key={detalle.id}>
                    <td>{detalle.producto_nombre}</td>
                    <td>{detalle.cantidad}</td>
                    <td>{Number(detalle.precio_unitario).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="success" onClick={generarPDF}>
              Descargar PDF
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistorialVentas;
