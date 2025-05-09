const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { nombre, email, contra } = req.body;

  if (!nombre || !email || !contra) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  db.query(
    'INSERT INTO usuarios (nombre, email, contra) VALUES (?, ?, ?)',
    [nombre, email, contra],
    (err, result) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }

      res.status(201).json({
        id: result.insertId,
        nombre,
        email,
      });
    }
  );
});

router.get('/', (req, res) => {
  db.query('SELECT id, nombre, email FROM usuarios', (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    res.json(rows);
  });
});

router.put('/:id', (req, res) => {
  const { nombre, email, contra } = req.body;
  const { id } = req.params;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  let query = '';
  let params = [];

  if (contra && contra.trim() !== '') {
    query = 'UPDATE usuarios SET nombre = ?, email = ?, contra = ? WHERE id = ?';
    params = [nombre, email, contra, id];
  } else {
    query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    params = [nombre, email, id];
  }

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }

    res.json({ message: 'Usuario actualizado' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }

    res.json({ message: 'Usuario eliminado' });
  });
});

module.exports = router;
