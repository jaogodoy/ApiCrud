const mongoose = require('mongoose');

const SaleProductSchema = new mongoose.Schema({
  codigoInterno: String,
  nome: String,
  quantidade: Number,
  valorUnitario: Number
}, { _id: false });

const SaleSchema = new mongoose.Schema({
  data: { type: Date, required: true },
  numeroNota: { type: String, required: true, unique: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  produtos: [SaleProductSchema],
  totalVenda: Number
});

module.exports = mongoose.model('Sale', SaleSchema);
