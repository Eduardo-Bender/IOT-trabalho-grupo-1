const { SensorData } = require('../models');

// Salva nova leitura no banco
async function salvarLeitura({ distancia, temperatura, placaId }) {
  return await SensorData.create({ distancia, temperatura, placaId });
}

// Lista todas as leituras
async function listarLeituras() {
  return await SensorData.findAll({ order: [['dataHora', 'DESC']] });
}

// Busca uma leitura por ID
async function buscarLeitura(id) {
  return await SensorData.findByPk(id);
}

// Remove uma leitura por ID
async function removerLeitura(id) {
  return await SensorData.destroy({ where: { id } });
}

async function buscarPlaca(id) {
  // Implementar busca de placa por ID
  return await SensorData.findByPk(id);
}

async function criarPlaca(nome, descricao) {
  // Implementar criação de placa
  return await SensorData.create({ nome, descricao });
}

async function listarPlacas() {
  // Implementar listagem de placas
  return await SensorData.findAll();
}

async function removerPlaca(id) {
  // Implementar remoção de placa
  return await SensorData.destroy({ where: { id } });
}

module.exports = {
  salvarLeitura,
  listarLeituras,
  buscarLeitura,
  removerLeitura,
};