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

module.exports = {
  salvarLeitura,
  listarLeituras,
  buscarLeitura,
  removerLeitura,
};