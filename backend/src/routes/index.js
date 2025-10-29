const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.post('/sensores', ctrl.criarLeitura);
router.get('/sensores', ctrl.listarLeituras);
router.get('/sensores/:id', ctrl.buscarLeitura);
router.delete('/sensores/:id', ctrl.removerLeitura);

module.exports = router;