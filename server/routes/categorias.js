const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categorias';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener categorías' });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { nombre, descrip } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

  const sql = 'INSERT INTO categorias (nombre, descrip) VALUES (?, ?)';
  db.query(sql, [nombre, descrip], (err) => {
    if (err) return res.status(500).json({ error: 'Error al agregar categoría' });
    res.status(201).json({ message: 'Categoría agregada' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descrip } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

  const sql = 'UPDATE categorias SET nombre = ?, descrip = ? WHERE id = ?';
  db.query(sql, [nombre, descrip, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al editar categoría' });
    res.json({ message: 'Categoría actualizada' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categorias WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar categoría' });
    res.json({ message: 'Categoría eliminada' });
  });
});

module.exports = router;