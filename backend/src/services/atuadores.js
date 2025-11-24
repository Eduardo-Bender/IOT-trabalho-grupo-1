const mqtt = require('mqtt');
const config = require('../config');
const service = require('./index');

const client = mqtt.connect(config.mqtt.brokerUrl);
// PIN, ESTADO (1 ou 0), TEMPO (ms) ex: "0,1,1000" para ligar o atuador no pino especificado por 1 segundo
client.on('connect', () => {
  console.log('Conectado ao broker MQTT para orquestração.');
  client.subscribe('grupo1/iot/sensors', (err) => {
    if (!err) console.log('Assinado o tópico de sensores: grupo1/iot/sensors');
  });
});

client.on('error', (error) => {
  console.error('Erro no cliente MQTT:', error);
});


function publica(espid, command)
{
  publishCommand(espid, command);
}

// Função genérica para publicar comandos
const publishCommand = (espId, command) => {
  const topic = `grupo1/${espId}/subscribe`; // Tópico fixo para todos os comandos
  client.publish(topic, command, (err) => {
    if (err) console.error(`Erro ao publicar no tópico ${topic}:`, err);
    else console.log(`Comando '${command}' publicado para ${topic}`);
  });
};

// Lógica de tratamento de mensagens
client.on('message', (topic, message) => {
  if(message.toString() === "") return;
  const data = JSON.parse(message.toString());
  const espId = data.esp_id
  const sensor = data.sensors[0];
  console.log(`Mensagem recebida de ${topic}:`, data, message.toString());

  if (sensor.type !== 'ALERT') {
    service.salvarDadosSensor(espId, sensor.type, sensor.pin, sensor.value);
  }

  switch (espId) {
    case 1:
      if(sensor.type === 'TECLADO') {
        if (sensor.value === config.senhaAcesso) {
          console.log('Senha correta! Acesso liberado.');
          publishCommand(1, `${config.esp1VibrationEnginePin},1,1000`); // Vibração curta
          publishCommand(4, `${config.esp4GreenPin},1,3000`); // LED Verde por 3s
          publishCommand(2, `${config.esp2RelePin},1,0`);    // Aciona relé (desbloqueio)
        } else {
          console.log('Senha incorreta! Acesso negado.');
          publishCommand(1, `${config.esp1VibrationEnginePin},1,3000`); // Vibração longa
          publishCommand(4, `${config.esp4RedPin},1,3000`); // LED Vermelho por 3s
        }
      }
      break;
    case 2:
      if (sensor.type === 'ALERT') {
        if (sensor.value === 1) {
          publishCommand(4, `${config.esp4GreenPin},1,0`);   // LED Verde aceso
          publishCommand(4, `${config.esp4RedPin},1,0`);     // LED Vermelho aceso
        } else if (sensor.value === 0) {
          console.log('Alerta de porta removido.');
          publishCommand(4, `${config.esp4GreenPin},0,0`);   // Apaga LED Verde
          publishCommand(4, `${config.esp4RedPin},0,0`);     // Apaga LED Vermelho
         }
      }
      break;
    case 3:
      if(sensor.type === 'UMIDADE_TEMPERATURA') {
        const temperatura = sensor.value[1]; // [umidade, temperatura]
        if (temperatura > config.limiteTemperatura) {
          publishCommand(4, `${config.esp4YellowPin},1,0`); // Acende LED Amarelo
         } else {
          publishCommand(4, `${config.esp4YellowPin},0,0`); // Apaga LED Amarelo
         }
      }
      break;
  }
});

module.exports = {
  client,
  publishCommand,
  publica: publica
};
