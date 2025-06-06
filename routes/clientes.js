const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { cpf, nome, endereco, telefone, email } = req.body;
    const cliente = new Cliente({ cpf, nome, endereco, telefone, email });
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar cliente', erro: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar clientes', erro: err.message });
  }
});

router.get('/buscar', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ mensagem: 'Parâmetro de busca "q" é obrigatório' });
    const regex = new RegExp(q, 'i');
    const clientes = await Cliente.find({
      $or: [
        { nome: regex },
        { email: regex }
      ]
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar clientes', erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar cliente', erro: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar cliente', erro: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    res.json({ mensagem: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover cliente', erro: err.message });
  }
});

module.exports = router;
