const service = require('../services');

const sensorsDict = {
  0: "SensorTemperatura",
  1: "SensorUltrasonico",
  2: "SensorAcelerometroEGiroscopio",
  3: "SensorGestosECor",
  4: "SensorVelocidadeEncoder",
  5: "SensorModuloRele",
  6: "EstadoMotorVibracao",
  7: "SensorJoystick",
  8: "SensorTeclado",
  9: "SensorIR",
  10: "SensorUmidadeETemperatura",
};

// Recebe dados MQTT e processa
exports.processarDadosMQTT = async (req, res) => {
  try {
    const { esp_id, sensors } = req.body;

    if (!esp_id || !sensors || !Array.isArray(sensors)) {
      return res.status(400).json({ error: 'Formato inválido' });
    }

    // Verifica se placa existe, se não, cria
    await service.garantirPlacaExiste(esp_id);

    // Processa cada sensor
    const resultados = [];
    for (const sensor of sensors) {
      const { type, pin, value } = sensor;
      
      const resultado = await service.salvarDadosSensor(esp_id, type, pin, value);
      resultados.push(resultado);
    }

    res.status(201).json({
      message: 'Dados processados com sucesso',
      placa_id: esp_id,
      sensores_salvos: resultados.length,
      resultados,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todas as placas
exports.listarPlacas = async (req, res) => {
  try {
    const placas = await service.listarPlacas();
    res.json(placas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Buscar placa específica
exports.buscarPlaca = async (req, res) => {
  try {
    const { id } = req.params;
    const placa = await service.buscarPlaca(id);
    if (!placa) return res.status(404).json({ error: 'Placa não encontrada' });
    res.json(placa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover placa
exports.removerPlaca = async (req, res) => {
  try {
    const { id } = req.params;
    await service.removerPlaca(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar leituras de um tipo de sensor
exports.listarSensorPorTipo = async (req, res) => {
  try {
    const { sensorTipo } = req.params;
    const leituras = await service.listarSensorPorTipo(sensorTipo);
    res.json(leituras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar leituras de um tipo de sensor por placa
exports.listarSensorPorTipoEPlaca = async (req, res) => {
  try {
    const { sensorTipo, placaId } = req.params;
    const leituras = await service.listarSensorPorTipoEPlaca(sensorTipo, placaId);
    res.json(leituras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = exports;