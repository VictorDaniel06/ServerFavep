const prisma = require('../lib/prisma');

module.exports = {
  async register(req, res) {
    console.log('➡️  Requisição recebida em /properties (create)');
    console.log('📦 Dados recebidos:', req.body);

    const { nome, area, localizacao, cultura, produtividade } = req.body;
    const userId = req.userId; // Middleware de autenticação

    if (!nome || !area || !localizacao) {
      console.warn('⚠️  Campos obrigatórios ausentes');
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, area, localizacao.'
      });
    }

    try {
      const propriedade = await prisma.gerenciaPropriedade.create({
        data: {
          nome,
          area: parseFloat(area),
          localizacao,
          cultura: cultura || '',
          produtividade: produtividade || '',
          userId
        }
      });

      console.log('✅ Propriedade criada com sucesso:', propriedade);
      return res.status(201).json(propriedade);
    } catch (err) {
      console.error('❌ Erro ao criar propriedade:', err);
      return res.status(500).json({ error: 'Erro ao criar propriedade.' });
    }
  },

  async list(req, res) {
    console.log('➡️  Requisição recebida em /properties (list)');

    try {
      const propriedades = await prisma.gerenciaPropriedade.findMany({
        where: { userId: req.userId },
        include: {
          maquinarios: true,
          producoes: true,
          movimentacoes: true,
          financas: true
        }
      });

      console.log(`📄 ${propriedades.length} propriedade(s) encontrada(s).`);
      return res.status(200).json(propriedades);
    } catch (err) {
      console.error('❌ Erro ao buscar propriedades:', err);
      return res.status(500).json({ error: 'Erro ao buscar propriedades.' });
    }
  },

  async getById(req, res) {
    console.log('➡️  Requisição recebida em /properties/:id');
    const { id } = req.params;

    try {
      const propriedade = await prisma.gerenciaPropriedade.findUnique({
        where: { id: parseInt(id) },
        include: {
          maquinarios: true,
          producoes: true,
          movimentacoes: true,
          financas: true
        }
      });

      if (!propriedade || propriedade.userId !== req.userId) {
        return res.status(404).json({ error: 'Propriedade não encontrada.' });
      }

      console.log('🔍 Propriedade encontrada:', propriedade);
      return res.status(200).json(propriedade);
    } catch (err) {
      console.error('❌ Erro ao buscar propriedade por ID:', err);
      return res.status(500).json({ error: 'Erro ao buscar propriedade.' });
    }
  },

  async update(req, res) {
    console.log('➡️  Requisição recebida em /properties/:id (update)');
    const { id } = req.params;
    const { nome, area, localizacao, cultura, produtividade } = req.body;

    try {
      const propriedade = await prisma.gerenciaPropriedade.findUnique({ where: { id: parseInt(id) } });

      if (!propriedade || propriedade.userId !== req.userId) {
        return res.status(404).json({ error: 'Propriedade não encontrada.' });
      }

      const updateData = {
        nome,
        area: parseFloat(area),
        localizacao
      };

      if (cultura !== undefined) updateData.cultura = cultura;
      if (produtividade !== undefined) updateData.produtividade = produtividade;

      const updated = await prisma.gerenciaPropriedade.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      console.log('🔄 Propriedade atualizada:', updated);
      return res.status(200).json(updated);
    } catch (err) {
      console.error('❌ Erro ao atualizar propriedade:', err);
      return res.status(500).json({ error: 'Erro ao atualizar propriedade.' });
    }
  },

  async delete(req, res) {
    console.log('➡️  Requisição recebida em /properties/:id (delete)');
    const { id } = req.params;

    try {
      const propriedade = await prisma.gerenciaPropriedade.findUnique({ where: { id: parseInt(id) } });

      if (!propriedade || propriedade.userId !== req.userId) {
        return res.status(404).json({ error: 'Propriedade não encontrada.' });
      }

      await prisma.gerenciaPropriedade.delete({ where: { id: parseInt(id) } });

      console.log('🗑️  Propriedade deletada:', id);
      return res.status(204).send();
    } catch (err) {
      console.error('❌ Erro ao deletar propriedade:', err);
      return res.status(500).json({ error: 'Erro ao deletar propriedade.' });
    }
  }
};
