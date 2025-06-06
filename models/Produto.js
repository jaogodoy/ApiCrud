const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  codigoInterno: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  descricao: { type: String },
  valorUnitario: { type: Number, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }
});

module.exports = mongoose.model('Produto', ProdutoSchema);
