const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

// Rota principal para receber dados MQTT
router.post('/dados', ctrl.processarDadosMQTT);

// Rotas de Placas
router.get('/placas', ctrl.listarPlacas);
router.get('/placas/:id', ctrl.buscarPlaca);
router.delete('/placas/:id', ctrl.removerPlaca);

// Rotas de Sensores
router.get('/sensores/:sensorTipo', ctrl.listarSensorPorTipo);
router.get('/sensores/:sensorTipo/:placaId', ctrl.listarSensorPorTipoEPlaca);

module.exports = router;