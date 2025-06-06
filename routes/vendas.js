const express = require('express');
const router = express.Router();
const Venda = require('../models/Venda');
const Cliente = require('../models/Cliente');
const auth = require('../middlewares/authMiddleware');


router.post('/', auth, async (req, res) => {
  try {
    const { data, numeroNota, cliente, produtos, totalVenda } = req.body;
    if (!(await Cliente.findById(cliente))) {
      return res.status(400).json({ mensagem: 'Cliente não encontrado' });
    }
    const venda = new Venda({ data, numeroNota, cliente, produtos, totalVenda });
    await venda.save();
    res.status(201).json(venda);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar venda', erro: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const vendas = await Venda.find().populate('cliente');
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar vendas', erro: err.message });
  }
});


router.get('/buscar', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ mensagem: 'Parâmetro de busca "q" é obrigatório' });
    const regex = new RegExp(q, 'i');
    let vendas = await Venda.find().populate('cliente');
    let resultado = vendas.filter(venda =>
      regex.test(venda.numeroNota) || (venda.cliente && regex.test(venda.cliente.nome))
    );
    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: 'Venda não encontrada' });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar vendas', erro: err.message });
  }
});


router.get('/numero/:numeroNota', async (req, res) => {
  try {
    const venda = await Venda.findOne({ numeroNota: req.params.numeroNota }).populate('cliente');
    if (!venda) return res.status(404).json({ mensagem: 'Venda não encontrada' });
    res.json(venda);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar venda por número da nota', erro: err.message });
  }
});


router.get('/cliente/:nome', async (req, res) => {
  try {
    const regex = new RegExp(req.params.nome, 'i');
    const vendas = await Venda.find().populate('cliente');
    const resultado = vendas.filter(venda => venda.cliente && regex.test(venda.cliente.nome));
    if (resultado.length === 0) return res.status(404).json({ mensagem: 'Venda não encontrada' });
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar vendas', erro: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const venda = await Venda.findById(req.params.id).populate('cliente');
    if (!venda) return res.status(404).json({ mensagem: 'Venda não encontrada' });
    res.json({ venda });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar venda', erro: err.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const venda = await Venda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venda) return res.status(404).json({ mensagem: 'Venda não encontrada' });
    res.json(venda);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar venda', erro: err.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const venda = await Venda.findByIdAndDelete(req.params.id);
    if (!venda) return res.status(404).json({ mensagem: 'Venda não encontrada' });
    res.json({ mensagem: 'Venda removida com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover venda', erro: err.message });
  }
});

module.exports = router;
