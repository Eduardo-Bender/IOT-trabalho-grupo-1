const {
  Placa,
  SensorTemperatura,
  SensorUltrasonico,
  SensorAcelerometroEGiroscopio,
  SensorGestosECor,
  SensorVelocidadeEncoder,
  SensorJoystick,
  SensorTeclado,
  SensorIR,
  SensorUmidadeETemperatura,
} = require('../models');

// Mapeamento de tipos para modelos
const sensorsMap = {
  'TEMP': SensorTemperatura,
  'ULTRASSONICO': SensorUltrasonico,
  'ACELEROMETRO_GIROSCOPIO': SensorAcelerometroEGiroscopio,
  'GESTOS_COR': SensorGestosECor,
  'VELOCIDADE_ENCODER': SensorVelocidadeEncoder,
  'JOYSTICK': SensorJoystick,
  'TECLADO': SensorTeclado,
  'IR': SensorIR,
  'UMIDADE_TEMPERATURA': SensorUmidadeETemperatura,
};

// Garante que a placa existe
async function garantirPlacaExiste(placaId) {
  const placa = await Placa.findByPk(placaId);
  if (!placa) {
    return await Placa.create({ id: placaId });
  }
  return placa;
}

// Salva dados de sensor
async function salvarDadosSensor(placaId, sensorTipo, pin, value) {
  const SensorModel = sensorsMap[sensorTipo];
  await garantirPlacaExiste(placaId);
  
  if (!SensorModel) {
    console.warn(`Aviso: Tipo de sensor '${sensorTipo}' não reconhecido. Dados não serão salvos.`);
    return;
  }

  // Prepara os dados conforme o tipo de sensor
  const dadosParaSalvar = prepararDadosSensor(sensorTipo, pin, value);
  dadosParaSalvar.placaId = placaId;
  console.log("dados pra salvar: ", dadosParaSalvar);

  const leitura = await SensorModel.create(dadosParaSalvar);
  console.log("leitura: ", leitura);
  return {
    sensorTipo,
    pin,
    value,
    id: leitura.id,
  };
}

// Prepara dados específicos para cada tipo de sensor
function prepararDadosSensor(sensorTipo, pin, value) {
  switch (sensorTipo) {
    case 'TEMP':
      return { pin, temperatura: value };
    case 'ULTRASSONICO':
      return { pin, distancia: value };
    case 'UMIDADE_TEMPERATURA':
      return { pin, umidade: value[0] || 0, temperatura: value[1] || 0 };
    case 'VELOCIDADE_ENCODER':
      return { pin, contagem: value };
    case 'ACELEROMETRO_GIROSCOPIO':
      return {
        pin,
        acel_x: value.acel_x || 0,
        acel_y: value.acel_y || 0,
        acel_z: value.acel_z || 0,
        giro_x: value.giro_x || 0,
        giro_y: value.giro_y || 0,
        giro_z: value.giro_z || 0,
        temperatura_mpu: value.temperatura_mpu || null,
      };
    case 'IR':
      return { pin, codigo: String(value) };
    case 'TECLADO':
      return { pin, tecla: String(value) };
    case 'GESTOS_COR':
      return { pin, gesto: String(value.gesto), cor_r: Number(value.cor_r), cor_g: Number(value.cor_g), cor_b: Number(value.cor_b) };
    case 'JOYSTICK': 
      return { pin, eixo_x: value.eixo_x, eixo_y: value.eixo_y, clique: Boolean(value.clique) };
    default:
      return { pin };
  }
}

// Listar leituras por tipo de sensor
async function listarSensorPorTipo(sensorTipo) {
  const SensorModel = sensorsMap[sensorTipo];
  if (!SensorModel) throw new Error(`Sensor tipo '${sensorTipo}' não encontrado`);
  return await SensorModel.findAll({ order: [['dataHora', 'DESC']] });
}

// Listar leituras por tipo e placa
async function listarSensorPorTipoEPlaca(sensorTipo, placaId) {
  const SensorModel = sensorsMap[sensorTipo];
  if (!SensorModel) throw new Error(`Sensor tipo '${sensorTipo}' não encontrado`);
  return await SensorModel.findAll({
    where: { placaId },
    order: [['dataHora', 'DESC']],
  });
}

// Listar leituras por pin
async function listarSensorPorPin(sensorTipo, pin) {
  const SensorModel = sensorsMap[sensorTipo];
  if (!SensorModel) throw new Error(`Sensor tipo '${sensorTipo}' não encontrado`);
  return await SensorModel.findAll({
    where: { pin },
    order: [['dataHora', 'DESC']],
  });
}

// Listar leituras por pin e placa
async function listarSensorPorPinEPlaca(sensorTipo, pin, placaId) {
  const SensorModel = sensorsMap[sensorTipo];
  if (!SensorModel) throw new Error(`Sensor tipo '${sensorTipo}' não encontrado`);
  return await SensorModel.findAll({
    where: { pin, placaId },
    order: [['dataHora', 'DESC']],
  });
}

// Operações com Placa
async function listarPlacas() {
  return await Placa.findAll();
}

async function buscarPlaca(id) {
  return await Placa.findByPk(id);
}

async function removerPlaca(id) {
  return await Placa.destroy({ where: { id } });
}

module.exports = {
  garantirPlacaExiste,
  salvarDadosSensor,
  listarSensorPorTipo,
  listarSensorPorTipoEPlaca,
  listarPlacas,
  buscarPlaca,
  removerPlaca,
  listarSensorPorPin,
  listarSensorPorPinEPlaca,
};