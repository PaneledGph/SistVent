const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, clientes) => {
    if (err) {
      console.error('Error al obtener los clientes:', err);
      return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
    res.json(clientes);
  });
});

router.post('/', (req, res) => {
  const { nombre, telefono, email, direc } = req.body;

  if (!nombre || !telefono || !email || !direc) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  db.query(
    'INSERT INTO clientes (nombre, telefono, email, direc) VALUES (?, ?, ?, ?)', 
    [nombre, telefono, email, direc], 
    (err, result) => {
      if (err) {
        console.error('Error al registrar cliente:', err);
        return res.status(500).json({ error: 'Error al registrar cliente' });
      }

      const nuevoCliente = { id: result.insertId, nombre, telefono, email, direc };
      res.status(201).json(nuevoCliente);
    }
  );
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM clientes WHERE id = ?', [req.params.id], (err, cliente) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
    if (cliente.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(cliente[0]);
  });
});

router.put('/:id', (req, res) => {
  const { nombre, telefono, email, direc } = req.body;

  if (!nombre || !telefono || !email || !direc) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  db.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direc = ? WHERE id = ?', 
    [nombre, telefono, email, direc, req.params.id], 
    (err, result) => {
      if (err) {
        console.error('Error al actualizar cliente:', err);
        return res.status(500).json({ error: 'Error al actualizar cliente' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      
      res.json({ id: req.params.id, nombre, telefono, email, direc });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);
      return res.status(500).json({ error: 'Error al eliminar cliente' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  });
});

module.exports = router;
