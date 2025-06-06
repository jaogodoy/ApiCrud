const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const categoria = new Categoria({ nome, descricao });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar categoria', erro: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar categorias', erro: err.message });
  }
});

router.get('/buscar', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ mensagem: 'Parâmetro de busca "q" é obrigatório' });
    const regex = new RegExp(q, 'i');
    const categorias = await Categoria.find({
      $or: [
        { nome: regex },
        { descricao: regex }
      ]
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar categorias', erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar categoria', erro: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar categoria', erro: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover categoria', erro: err.message });
  }
});

module.exports = router;
