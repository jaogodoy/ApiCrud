const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado.' });
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'Senha inválida.' });
    }
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: err.message });
  }
});

router.post('/registrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário.', erro: err.message });
  }
});

module.exports = router;
