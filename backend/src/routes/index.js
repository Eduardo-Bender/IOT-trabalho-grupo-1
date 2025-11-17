const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

//rota pra receber dados mqtt
router.post('/dados', ctrl.processarDadosMQTT);

// Rotas de Placas
router.get('/placas', ctrl.listarPlacas);
router.get('/placas/:id', ctrl.buscarPlaca);
router.delete('/placas/:id', ctrl.removerPlaca);

// Rotas de Sensores
router.get('/sensores/:sensorTipo/pin/:pin/:placaId', ctrl.listarSensorPorPinEPlaca);
router.get('/sensores/:sensorTipo/pin/:pin', ctrl.listarSensorPorPin);
router.get('/sensores/:sensorTipo/:placaId', ctrl.listarSensorPorTipoEPlaca);
router.get('/sensores/:sensorTipo', ctrl.listarSensorPorTipo);

module.exports = router;