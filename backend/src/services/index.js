const {
  Placa,
  SensorTemperatura,
  SensorUltrasonico,
  SensorAcelerometroEGiroscopio,
  SensorGestosECor,
  SensorVelocidadeEncoder,
  SensorModuloRele,
  EstadoMotorVibracao,
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
  'MODULO_RELE': SensorModuloRele,
  'MOTOR_VIBRACAO': EstadoMotorVibracao,
  'JOYSTICK': SensorJoystick,
  'TECLADO': SensorTeclado,
  'IR': SensorIR,
  'UMIDADE_TEMPERATURA': SensorUmidadeETemperatura,
};

// Garante que a placa existe
async function garantirPlacaExiste(placaId) {
  const placa = await Placa.findByPk(placaId);
  console.log("entrei aqui? ",placa, placaId);
  if (!placa) {
    return await Placa.create({ id: placaId });
  }
  console.log("entrei aqui! ",placa);
  return placa;
}

// Salva dados de sensor
async function salvarDadosSensor(placaId, sensorTipo, pin, value) {
  const SensorModel = sensorsMap[sensorTipo];
  
  if (!SensorModel) {
    throw new Error(`Tipo de sensor '${sensorTipo}' não reconhecido`);
  }

  // Prepara os dados conforme o tipo de sensor
  const dados = prepararDadosSensor(sensorTipo, pin, value);
  dados.placaId = placaId;

  const leitura = await SensorModel.create(dados);
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
      return { temperatura: value };
    
    case 'ULTRASSONICO':
      return { distancia: value };
    
    case 'ACELEROMETRO_GIROSCOPIO':
      // Espera um objeto com acel_x, acel_y, acel_z, giro_x, giro_y, giro_z
      return {
        acel_x: value.acel_x || 0,
        acel_y: value.acel_y || 0,
        acel_z: value.acel_z || 0,
        giro_x: value.giro_x || 0,
        giro_y: value.giro_y || 0,
        giro_z: value.giro_z || 0,
      };
    
    case 'GESTOS_COR':
      return {
        cor_r: value.cor_r || 0,
        cor_g: value.cor_g || 0,
        cor_b: value.cor_b || 0,
        cor_c: value.cor_c || 0,
        proximidade: value.proximidade || 0,
        gesto: value.gesto || null,
      };
    
    case 'VELOCIDADE_ENCODER':
      return { velocidade: value };
    
    case 'MODULO_RELE':
      return { ligado: Boolean(value) };
    
    case 'MOTOR_VIBRACAO':
      return { ligado: Boolean(value) };
    
    case 'JOYSTICK':
      return {
        eixo_x: value.eixo_x || 0,
        eixo_y: value.eixo_y || 0,
        botao: value.botao || false,
      };
    
    case 'TECLADO':
      return { tecla: String(value) };
    
    case 'IR':
      return { codigo: String(value) };
    
    case 'UMIDADE_TEMPERATURA':
      return {
        temperatura: value.temperatura || 0,
        umidade: value.umidade || 0,
      };
    
    default:
      return {};
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
};