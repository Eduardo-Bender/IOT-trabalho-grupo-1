const mqtt = require('mqtt');
const config = require('../config');
const service = require('./index');

const client = mqtt.connect(config.mqtt.brokerUrl);
// PIN, ESTADO (1 ou 0), TEMPO (ms) ex: "0,1,1000" para ligar o atuador no pino especificado por 1 segundo
client.on('connect', () => {
  console.log('Conectado ao broker MQTT para orquestração.');
  client.subscribe('iot/+/events', (err) => {
    if (!err) console.log('Assinado o tópico de eventos: iot/+/events');
  });
  client.subscribe('iot/+/sensors', (err) => {
    if (!err) console.log('Assinado o tópico de sensores: iot/+/sensors');
  });
});

client.on('error', (error) => {
  console.error('Erro no cliente MQTT:', error);
});

const doorTimers = {};

// Função genérica para publicar comandos
const publishCommand = (espId, command) => {
  // const topic = `iot/${espId}/commands`;
  const topic = "grupo1_subscribe_mqtt"; // Tópico fixo para todos os comandos
  client.publish(topic, command, (err) => {
    if (err) console.error(`Erro ao publicar no tópico ${topic}:`, err);
    else console.log(`Comando '${command}' publicado para ${topic}`);
  });
};

// Lógica de tratamento de mensagens
client.on('message', (topic, message) => {
  const topicParts = topic.split('/');
  const espId = topicParts[1];
  const messageType = topicParts[2];
  const data = JSON.parse(message.toString());
  console.log(`Mensagem recebida de ${topic}:`, data, message.toString());
  if (messageType === 'events') {
    // Eventos de ESP1: Teclado
    if (espId === 'esp1' && data.event === 'password_entry') {
      if (data.password === config.senhaAcesso) {
        console.log('Senha correta! Acesso liberado.');
        publishCommand('esp1', `${config.esp1VibrationEnginePin},1,1000`); // Vibração curta
        publishCommand('esp4', `${config.esp4GreenPin},1,3000`); // LED Verde por 3s
        publishCommand('esp2', `${config.esp2RelePin},1,0`);    // Aciona relé (desbloqueio)
      } else {
        console.log('Senha incorreta! Acesso negado.');
        publishCommand('esp1', `${config.esp1VibrationEnginePin},1,3000`); // Vibração longa
        publishCommand('esp4', `${config.esp4RedPin},1,3000`); // LED Vermelho por 3s
      }
    }
    
    // Eventos de ESP2: Porta
    if (espId === 'esp2' && data.sensor === 'door') {
      if (data.state === 'open') {
        console.log('Porta aberta. Iniciando timer de 5s...');
        doorTimers[espId] = setTimeout(() => {
          console.log('Alerta: Porta aberta por muito tempo!');
          publishCommand('esp4', `${config.esp4GreenPin},1,0`); // LED Verde aceso
          publishCommand('esp4', `${config.esp4RedPin},1,0`); // LED Vermelho aceso
          delete doorTimers[espId];
        }, 5000);
      } else if (data.state === 'closed') {
        if (doorTimers[espId]) {
          console.log('Porta fechada a tempo.');
          clearTimeout(doorTimers[espId]);
          delete doorTimers[espId];
        }
        // Apaga os LEDs de alerta de porta aberta
        publishCommand('esp4', `${config.esp4GreenPin},0,0`);
        publishCommand('esp4', `${config.esp4RedPin},0,0`);
      }
    }
  } 
  
  else if (messageType === 'sensors') {
    // Salvar dados de qualquer sensor
    if (data.type === 'sensorData') return;
    console.log(`Salvando dados do sensor do ${espId}:`, data);
    service.salvarDadosSensor({
      placaId: espId,
      sensorTipo: data.type,
      pin: data.pin,
      value: data
    });

    // Lógica específica para sensor de temperatura do ESP3
    if (espId === 'esp3' && data.type === 'temperature') {
      if (data.value > config.limiteTemperatura) {
        console.log(`Alerta de Temperatura: ${data.value}°C excede o limite de ${config.limiteTemperatura}°C.`);
        publishCommand('esp4', `${config.esp4YellowPin},1,0`); // Acende LED Amarelo
      } else {
        publishCommand('esp4', `${config.esp4YellowPin},0,0`); // Apaga LED Amarelo
      }
    }
  }
});

module.exports = {
  client,
  publishCommand,
};
