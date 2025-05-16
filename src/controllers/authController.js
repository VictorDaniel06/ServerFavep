const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, { expiresIn: 86400 });
}

module.exports = {
  async register(req, res) {
    console.log('➡️  Requisição recebida em /register');
    console.log('📦 Dados recebidos:', req.body);

    const { name, email, password, confirmPassword, telefone, fotoPerfil, cpf } = req.body;

    if (!name || !email || !telefone || !password || !confirmPassword) {
      console.warn('⚠️  Campos obrigatórios ausentes');
      return res.status(400).json({
        error: 'Campos obrigatórios: name, email, telefone, password, confirmPassword.'
      });
    }

    if (cpf && !/^\d{11}$/.test(cpf)) {
      return res.status(400).json({ error: 'CPF inválido. Deve conter exatamente 11 dígitos numéricos.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já existe com este email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          telefone,
          fotoPerfil,
          cpf: cpf || null,
          password: hashedPassword
        }
      });

      user.password = undefined;

      console.log('✅ Usuário registrado com sucesso:', user);

      return res.status(201).json({
        user,
        token: generateToken({ id: user.id })
      });
    } catch (err) {
      console.error('❌ Erro no register:', err);
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  },

  async login(req, res) {
    console.log('➡️  Requisição recebida em /login');
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn('⚠️  Campos obrigatórios ausentes');
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha inválida.' });
      }

      user.password = undefined;

      console.log('✅ Login realizado com sucesso');

      return res.status(200).json({
        user,
        token: generateToken({ id: user.id })
      });
    } catch (err) {
      console.error('❌ Erro no login:', err);
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  },

  async update(req, res) {
    const { name, email, telefone, fotoPerfil, password, confirmPassword, cpf } = req.body;
    const userId = req.userId;

    try {
      const updateData = { name, email, telefone, fotoPerfil };

      if (cpf && !/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ error: 'CPF inválido. Deve conter exatamente 11 dígitos numéricos.' });
      }

      if (cpf) {
        updateData.cpf = cpf;
      }

      if (password || confirmPassword) {
        if (!password || !confirmPassword) {
          return res.status(400).json({ error: 'Para alterar a senha, envie password e confirmPassword.' });
        }

        if (password !== confirmPassword) {
          return res.status(400).json({ error: 'As senhas não coincidem.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
        console.log('🔐 Senha atualizada para o usuário:', userId);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      user.password = undefined;

      console.log('🔄 Usuário atualizado:', user);

      const newToken = generateToken({ id: user.id });

      return res.status(200).json({
        user,
        token: newToken
      });
    } catch (err) {
      console.error('❌ Erro ao atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  },

  async delete(req, res) {
    const userId = req.userId;

    try {
      await prisma.user.delete({ where: { id: userId } });
      console.log('🗑️  Usuário deletado:', userId);
      return res.status(204).send();
    } catch (err) {
      console.error('❌ Erro ao deletar usuário:', err);
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  }
};
