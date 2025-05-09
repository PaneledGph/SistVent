const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND contra = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];
    delete user.contra;

    return res.json({ message: 'Login exitoso', user });
  });
});

module.exports = router;
