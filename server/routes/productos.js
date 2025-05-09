const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { categoria, search, minPrice, maxPrice } = req.query;

  let query = "SELECT * FROM productos WHERE 1=1";
  
  if (categoria) {
    query += ` AND category_id = ${db.escape(categoria)}`;
  }
  if (search) {
    query += ` AND nombre LIKE ${db.escape('%' + search + '%')}`;
  }
  if (minPrice) {
    query += ` AND precio >= ${db.escape(minPrice)}`;
  }
  if (maxPrice) {
    query += ` AND precio <= ${db.escape(maxPrice)}`;
  }

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener productos', error: err });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nombre, precio, stock, min_stock, category_id } = req.body;

  if (!nombre || !precio || !stock || !min_stock || !category_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'INSERT INTO productos (nombre, precio, stock, min_stock, category_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, precio, stock, min_stock, category_id], (err, results) => {
    if (err) {
      console.error('Error al agregar producto:', err);
      return res.status(500).json({ error: 'Error al agregar producto' });
    }
    res.status(201).json({ message: 'Producto agregado exitosamente' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, min_stock, category_id } = req.body;

  if (!nombre || !precio || !stock || !min_stock || !category_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'UPDATE productos SET nombre = ?, precio = ?, stock = ?, min_stock = ?, category_id = ? WHERE id = ?';
  db.query(sql, [nombre, precio, stock, min_stock, category_id, id], (err) => {
    if (err) {
      console.error('Error al editar producto:', err);
      return res.status(500).json({ error: 'Error al editar producto' });
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
});

module.exports = router;
