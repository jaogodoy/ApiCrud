require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');
const categoriasRoutes = require('./routes/categorias');
const produtosRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');
const vendasRoutes = require('./routes/vendas');

app.use('/api', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/vendas', vendasRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api_jg', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB', err);
});
