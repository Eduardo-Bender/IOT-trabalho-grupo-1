const service = require('../services');

exports.criarLeitura = async (req, res) => {
  const { distancia, temperatura } = req.body;
  if (distancia == null && temperatura == null) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  const leitura = await service.salvarLeitura({ distancia, temperatura });
  res.status(201).json(leitura);
};

exports.listarLeituras = async (req, res) => {
  const leituras = await service.listarLeituras();
  res.json(leituras);
};

exports.buscarLeitura = async (req, res) => {
  const leitura = await service.buscarLeitura(req.params.id);
  if (!leitura) return res.status(404).json({ error: 'Não encontrado' });
  res.json(leitura);
};

exports.removerLeitura = async (req, res) => {
  await service.removerLeitura(req.params.id);
  res.status(204).send();
};

exports.buscarPlaca = async (req, res) => {
  const placa = await service.buscarPlaca(req.params.id);
  if (!placa) return res.status(404).json({ error: 'Placa não encontrada' });
  res.json(placa);
};

exports.criarPlaca = async (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome || !descricao) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  const placa = await service.criarPlaca(nome, descricao);
  res.status(201).json(placa);
};

exports.listarPlacas = async (req, res) => {
  const placas = await service.listarPlacas();
  res.json(placas);
};

exports.removerPlaca = async (req, res) => {
  await service.removerPlaca(req.params.id);
  res.status(204).send();
};  