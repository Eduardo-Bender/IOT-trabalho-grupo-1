const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Modelo Placa (com id como MAC address ou ESP_ID)
const Placa = sequelize.define('Placa', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

// Sensor de Temperatura (DHT11 - temperatura)
const SensorTemperatura = sequelize.define('SensorTemperatura', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Ultrassônico (Distância)
const SensorUltrasonico = sequelize.define('SensorUltrasonico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  distancia: { type: DataTypes.FLOAT, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor de Umidade e Temperatura (DHT11 - temperatura + umidade)
const SensorUmidadeETemperatura = sequelize.define('SensorUmidadeETemperatura', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  umidade: { type: DataTypes.FLOAT, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor de Velocidade (Encoder - contador de pulsos)
const SensorVelocidadeEncoder = sequelize.define('SensorVelocidadeEncoder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  contagem: { type: DataTypes.INTEGER, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Acelerômetro e Giroscópio (MPU6050)
const SensorAcelerometroEGiroscopio = sequelize.define('SensorAcelerometroEGiroscopio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  acel_x: { type: DataTypes.FLOAT, allowNull: false },
  acel_y: { type: DataTypes.FLOAT, allowNull: false },
  acel_z: { type: DataTypes.FLOAT, allowNull: false },
  giro_x: { type: DataTypes.FLOAT, allowNull: false },
  giro_y: { type: DataTypes.FLOAT, allowNull: false },
  giro_z: { type: DataTypes.FLOAT, allowNull: false },
  temperatura_mpu: { type: DataTypes.FLOAT, allowNull: true },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor IR (Controle Remoto Infravermelho)
const SensorIR = sequelize.define('SensorIR', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  codigo: { type: DataTypes.STRING, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Teclado (Keypad)
const SensorTeclado = sequelize.define('SensorTeclado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false }, // Adicione este campo
  tecla: { type: DataTypes.STRING, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorJoystick = sequelize.define('SensorJoystick', { 
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false },
  eixo_x: { type: DataTypes.FLOAT, allowNull: false },
  eixo_y: { type: DataTypes.FLOAT, allowNull: false },
  clique: { type: DataTypes.BOOLEAN, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});
const SensorGestosECor = sequelize.define('SensorGestosECor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pin: { type: DataTypes.INTEGER, allowNull: false },
  gesto: { type: DataTypes.STRING, allowNull: false }, // up, down, left, right
  cor_r: { type: DataTypes.INTEGER, allowNull: false }, //0 à 255
  cor_g: { type: DataTypes.INTEGER, allowNull: false },
  cor_b: { type: DataTypes.INTEGER, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Relacionamentos: Uma Placa tem muitos sensores
Placa.hasMany(SensorTemperatura, { foreignKey: 'placaId' });
Placa.hasMany(SensorUltrasonico, { foreignKey: 'placaId' });
Placa.hasMany(SensorUmidadeETemperatura, { foreignKey: 'placaId' });
Placa.hasMany(SensorVelocidadeEncoder, { foreignKey: 'placaId' });
Placa.hasMany(SensorAcelerometroEGiroscopio, { foreignKey: 'placaId' });
Placa.hasMany(SensorIR, { foreignKey: 'placaId' });
Placa.hasMany(SensorTeclado, { foreignKey: 'placaId' });
Placa.hasMany(SensorJoystick, { foreignKey: 'placaId' });
Placa.hasMany(SensorGestosECor, { foreignKey: 'placaId' });

// Relacionamentos inversos
SensorTemperatura.belongsTo(Placa, { foreignKey: 'placaId' });
SensorUltrasonico.belongsTo(Placa, { foreignKey: 'placaId' });
SensorUmidadeETemperatura.belongsTo(Placa, { foreignKey: 'placaId' });
SensorVelocidadeEncoder.belongsTo(Placa, { foreignKey: 'placaId' });
SensorAcelerometroEGiroscopio.belongsTo(Placa, { foreignKey: 'placaId' });
SensorJoystick.belongsTo(Placa, { foreignKey: 'placaId' });
SensorGestosECor.belongsTo(Placa, { foreignKey: 'placaId' });
SensorIR.belongsTo(Placa, { foreignKey: 'placaId' });
SensorTeclado.belongsTo(Placa, { foreignKey: 'placaId' });

// Sincroniza as tabelas
sequelize.sync();

module.exports = {
  Placa,
  SensorTemperatura,
  SensorUltrasonico,
  SensorUmidadeETemperatura,
  SensorVelocidadeEncoder,
  SensorAcelerometroEGiroscopio,
  SensorIR,
  SensorTeclado,
  SensorJoystick,
  SensorGestosECor,
  sequelize,
};