const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { SensorData } = require('../models');

// Altere a porta para a que seu Arduino está conectado (ex: 'COM3' no Windows)
const port = new SerialPort('COM3', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

let ultimoDado = { distancia: null, temperatura: null };

// Salva nova leitura no banco
async function salvarLeitura({ distancia, temperatura }) {
  return await SensorData.create({ distancia, temperatura });
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

parser.on('data', (linha) => {
  // Espera linhas como: "Distancia em cm: 123.4" ou "23.5"
  if (linha.includes('Distancia em cm:')) {
    const valor = parseFloat(linha.split(':')[1]);
    ultimoDado.distancia = valor;
  } else {
    // Tenta converter para temperatura
    const temp = parseFloat(linha);
    if (!isNaN(temp)) {
      ultimoDado.temperatura = temp;
    }
  }
});

exports.getDados = () => ultimoDado;
module.exports = {
  salvarLeitura,
  listarLeituras,
  buscarLeitura,
  removerLeitura,
};