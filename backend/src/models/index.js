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
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Ultrassônico (Distância)
const SensorUltrasonico = sequelize.define('SensorUltrasonico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  distancia: { type: DataTypes.FLOAT, allowNull: false }, // em cm
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor de Umidade e Temperatura (DHT11 - temperatura + umidade)
const SensorUmidadeETemperatura = sequelize.define('SensorUmidadeETemperatura', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  umidade: { type: DataTypes.FLOAT, allowNull: false }, // em %
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor de Velocidade (Encoder - contador de pulsos)
const SensorVelocidadeEncoder = sequelize.define('SensorVelocidadeEncoder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contagem: { type: DataTypes.INTEGER, allowNull: false }, // número de detecções
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Acelerômetro e Giroscópio (MPU6050)
const SensorAcelerometroEGiroscopio = sequelize.define('SensorAcelerometroEGiroscopio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  acel_x: { type: DataTypes.FLOAT, allowNull: false },
  acel_y: { type: DataTypes.FLOAT, allowNull: false },
  acel_z: { type: DataTypes.FLOAT, allowNull: false },
  giro_x: { type: DataTypes.FLOAT, allowNull: false },
  giro_y: { type: DataTypes.FLOAT, allowNull: false },
  giro_z: { type: DataTypes.FLOAT, allowNull: false },
  temperatura_mpu: { type: DataTypes.FLOAT, allowNull: true }, // Tmp/340.00+36.53
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor IR (Controle Remoto Infravermelho)
const SensorIR = sequelize.define('SensorIR', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING, allowNull: false }, // Código HEX recebido
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Teclado (Keypad)
const SensorTeclado = sequelize.define('SensorTeclado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tecla: { type: DataTypes.STRING, allowNull: false }, // Tecla pressionada (1-9, *, #, a-d)
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

// Sensor Módulo Relé
const SensorModuloRele = sequelize.define('SensorModuloRele', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ligado: { type: DataTypes.BOOLEAN, allowNull: false }, // true = HIGH, false = LOW
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
Placa.hasMany(SensorModuloRele, { foreignKey: 'placaId' });

// Relacionamentos inversos
SensorTemperatura.belongsTo(Placa, { foreignKey: 'placaId' });
SensorUltrasonico.belongsTo(Placa, { foreignKey: 'placaId' });
SensorUmidadeETemperatura.belongsTo(Placa, { foreignKey: 'placaId' });
SensorVelocidadeEncoder.belongsTo(Placa, { foreignKey: 'placaId' });
SensorAcelerometroEGiroscopio.belongsTo(Placa, { foreignKey: 'placaId' });
SensorIR.belongsTo(Placa, { foreignKey: 'placaId' });
SensorTeclado.belongsTo(Placa, { foreignKey: 'placaId' });
SensorModuloRele.belongsTo(Placa, { foreignKey: 'placaId' });

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
  SensorModuloRele,
  sequelize,
};