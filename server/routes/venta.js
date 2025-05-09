const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { usuario_id, cliente_id, productos } = req.body;

  if (!usuario_id || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos para registrar la venta' });
  }

  const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Error iniciando transacción' });

    db.query('INSERT INTO ventas (usuario_id, cliente_id, total) VALUES (?, ?, ?)', 
      [usuario_id, cliente_id || null, total],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: 'Error al insertar venta' }));

        const ventaId = result.insertId;

        const detallePromises = productos.map(p => {
          return new Promise((resolve, reject) => {
            db.query('INSERT INTO venta_detalle (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', 
              [ventaId, p.id, p.cantidad, p.precio],
              err => {
                if (err) return reject(err);
                db.query('UPDATE productos SET stock = stock - ? WHERE id = ?', 
                  [p.cantidad, p.id],
                  err => {
                    if (err) return reject(err);
                    resolve();
                  });
              });
          });
        });

        Promise.all(detallePromises)
          .then(() => {
            db.commit(err => {
              if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar venta' }));
              res.json({ message: 'Venta registrada con éxito', ventaId });
            });
          })
          .catch(err => {
            db.rollback(() => res.status(500).json({ error: 'Error en detalles de venta', detail: err }));
          });
      });
  });
});

module.exports = router;
