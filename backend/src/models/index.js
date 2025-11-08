const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const Placa = sequelize.define('Placa', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
});


const SensorTemperatura = sequelize.define('SensorTemperatura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  temperatura: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

const SensorUltrasonico = sequelize.define('SensorUltrasonico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  distancia: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

const SensorAcelerometroEGiroscopio = sequelize.define('SensorAcelerometroEGiroscopio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /* 
  acel_x: { type: DataTypes.FLOAT },
  acel_y: { type: DataTypes.FLOAT },
  acel_z: { type: DataTypes.FLOAT },
  giro_x: { type: DataTypes.FLOAT },
  giro_y: { type: DataTypes.FLOAT },
  giro_z: { type: DataTypes.FLOAT },
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorGestosECor = sequelize.define('SensorGestosECor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /* 
  cor_r: { type: DataTypes.INTEGER },
  cor_g: { type: DataTypes.INTEGER },
  cor_b: { type: DataTypes.INTEGER },
  cor_c: { type: DataTypes.INTEGER }, // Clear (luz ambiente)
  proximidade: { type: DataTypes.INTEGER },
  gesto: { type: DataTypes.STRING }, // 'Cima', 'Baixo', 'Esquerda', etc.
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorVelocidadeEncoder = sequelize.define('SensorVelocidadeEncoder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /* 
  velocidade: { type: DataTypes.FLOAT }, // Ex: em RPM
  // ou
  posicao: { type: DataTypes.INTEGER }, // Ex: em passos
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorModuloRele = sequelize.define('SensorModuloRele', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /*
  ligado: { type: DataTypes.BOOLEAN, allowNull: false },
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const EstadoMotorVibracao = sequelize.define('EstadoMotorVibracao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /*
  ligado: { type: DataTypes.BOOLEAN, allowNull: false },
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorJoystick = sequelize.define('SensorJoystick', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /* 
  eixo_x: { type: DataTypes.INTEGER }, // Valor analógico
  eixo_y: { type: DataTypes.INTEGER }, // Valor analógico
  botao: { type: DataTypes.BOOLEAN }, // Pressionado ou não
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorTeclado = sequelize.define('SensorTeclado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /*
  tecla: { type: DataTypes.STRING, allowNull: false }, // Ex: '1', '#', 'A'
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorIR = sequelize.define('SensorIR', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /*
  codigo: { type: DataTypes.STRING, allowNull: false }, // Ex: '0xFF30CF'
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});

const SensorUmidadeETemperatura = sequelize.define('SensorUmidadeETemperatura', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  /* 
  temperatura: { type: DataTypes.FLOAT, allowNull: false },
  umidade: { type: DataTypes.FLOAT, allowNull: false },
  */
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
});


Placa.hasMany(SensorTemperatura, { foreignKey: 'placaId' });
SensorTemperatura.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorUltrasonico, { foreignKey: 'placaId' });
SensorUltrasonico.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorAcelerometroEGiroscopio, { foreignKey: 'placaId' });
SensorAcelerometroEGiroscopio.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorGestosECor, { foreignKey: 'placaId' });
SensorGestosECor.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorVelocidadeEncoder, { foreignKey: 'placaId' });
SensorVelocidadeEncoder.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorModuloRele, { foreignKey: 'placaId' });
SensorModuloRele.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(EstadoMotorVibracao, { foreignKey: 'placaId' });
EstadoMotorVibracao.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorJoystick, { foreignKey: 'placaId' });
SensorJoystick.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorTeclado, { foreignKey: 'placaId' });
SensorTeclado.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorIR, { foreignKey: 'placaId' });
SensorIR.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });

Placa.hasMany(SensorUmidadeETemperatura, { foreignKey: 'placaId' });
SensorUmidadeETemperatura.belongsTo(Placa, { foreignKey: 'placaId', targetKey: 'id' });


sequelize.sync();

module.exports = {
  sequelize,
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
};