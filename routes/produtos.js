const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { codigoInterno, nome, descricao, valorUnitario, categoria } = req.body;
    if (categoria && !(await Categoria.findById(categoria))) {
      return res.status(400).json({ mensagem: 'Categoria não encontrada' });
    }
    const produto = new Produto({ codigoInterno, nome, descricao, valorUnitario, categoria });
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar produto', erro: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().populate('categoria');
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: err.message });
  }
});

router.get('/buscar', async (req, res) => {
  try {
    const termo = req.query.q || '';
    const produtos = await Produto.find({
      $or: [
        { nome: new RegExp(termo, 'i') },
        { descricao: new RegExp(termo, 'i') }
      ]
    }).populate('categoria');
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('categoria');
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produto', erro: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar produto', erro: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover produto', erro: err.message });
  }
});

module.exports = router;
