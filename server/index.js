const express = require('express');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const ventaRoutes = require('./routes/venta');
const ventasRoutes = require('./routes/ventas');
const clientesRoutes = require('./routes/clientes');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/venta', ventaRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
