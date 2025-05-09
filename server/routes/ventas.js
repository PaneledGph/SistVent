const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { inicio, fin } = req.query;

  let query = `
    SELECT v.id, v.sale_date, v.total, 
           c.nombre AS cliente_nombre, 
           u.nombre AS vendedor_nombre
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN usuarios u ON v.usuario_id = u.id
    WHERE 1 = 1
  `;

  const params = [];

  if (inicio && fin) {
    query += ' AND DATE(v.sale_date) BETWEEN ? AND ?';
    params.push(inicio, fin);
  }

  query += ' ORDER BY v.sale_date DESC';

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al obtener las ventas:', err);
      return res.status(500).json({ error: 'Error al obtener ventas' });
    }
    res.json(result);
  });
});

router.get('/detalle/:ventaId', (req, res) => {
  const ventaId = req.params.ventaId;
  const query = `
    SELECT vd.id, vd.cantidad, vd.precio_unitario, p.nombre AS producto_nombre
    FROM venta_detalle vd
    JOIN productos p ON vd.producto_id = p.id
    WHERE vd.venta_id = ?
  `;

  db.query(query, [ventaId], (err, result) => {
    if (err) {
      console.error('Error al obtener los detalles de la venta:', err);
      return res.status(500).json({ error: 'Error al obtener los detalles de la venta' });
    }
    res.json(result);
  });
});

module.exports = router;
