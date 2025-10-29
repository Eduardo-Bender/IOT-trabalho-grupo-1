const { Sequelize, DataTypes } = require('sequelize');

// Cria conexão com SQLite (arquivo local chamado database.sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Define o modelo Placa
const Placa = sequelize.define('Placa', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define o modelo SensorData
const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false, // MAC address
  },
  distancia: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  temperatura: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Relacionamento: Uma Placa tem muitas leituras (SensorData)
Placa.hasMany(SensorData, { foreignKey: 'placaId' });
SensorData.belongsTo(Placa, { foreignKey: 'placaId' });

// Cria as tabelas se não existirem
sequelize.sync();

module.exports = { SensorData, Placa, sequelize };