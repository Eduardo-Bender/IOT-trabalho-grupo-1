const axios = require('axios');
const mqtt = require('mqtt'); // Adicionando a biblioteca MQTT

// --- Configurações ---
const API_URL = 'http://localhost:3001/api';
const TEST_ESP_ID = 'esp1';

const MQTT_BROKER = "broker.hivemq.com";
const MQTT_TOPICO_PARA_BACKEND = "grupo1_subscribe_mqtt"; // Onde o backend escuta
const MQTT_TOPICO_PARA_PYTHON_SCRIPT = "grupo1_publish_mqtt"; // Onde o script python escuta

// Mapeamento dos tipos de sensores para gerar dados de teste
const sensorDataGenerators = {
  'TEMP': () => ({ temperatura: parseFloat((Math.random() * 10 + 20).toFixed(2)) }),
  'ULTRASSONICO': () => ({ distancia: parseFloat((Math.random() * 100).toFixed(2)) }),
  'UMIDADE_TEMPERATURA': () => ({ temperatura: parseFloat((Math.random() * 10 + 20).toFixed(2)), umidade: parseFloat((Math.random() * 20 + 40).toFixed(2)) }),
  'VELOCIDADE_ENCODER': () => ({ contagem: Math.floor(Math.random() * 1000) }),
  'ACELEROMETRO_GIROSCOPIO': () => ({ acel_x: parseFloat((Math.random()*2-1).toFixed(4)), acel_y: parseFloat((Math.random()*2-1).toFixed(4)), acel_z: parseFloat((Math.random()*2-1).toFixed(4)), giro_x: parseFloat((Math.random()*360).toFixed(4)), giro_y: parseFloat((Math.random()*360).toFixed(4)), giro_z: parseFloat((Math.random()*360).toFixed(4)), temperatura_mpu: parseFloat((Math.random()*10+25).toFixed(2)) }),
  'IR': () => ({ codigo: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}` }),
  'TECLADO': () => ({ tecla: String.fromCharCode(65 + Math.floor(Math.random() * 26)) }),
  'JOYSTICK': () => ({ eixo_x: parseFloat(Math.random().toFixed(4)), eixo_y: parseFloat(Math.random().toFixed(4)), clique: Math.random() > 0.5 }),
  'GESTOS_COR': () => ({ gesto: ['up', 'down', 'left', 'right'][Math.floor(Math.random()*4)], cor_r: Math.floor(Math.random()*256), cor_g: Math.floor(Math.random()*256), cor_b: Math.floor(Math.random()*256) }),
};

const sensorTypes = Object.keys(sensorDataGenerators);

async function runHttpTests() {
  console.log('Iniciando testes de POST e GET para todos os modelos de sensores...');
  for (const sensorType of sensorTypes) {
    const pin = Math.floor(Math.random() * 40);
    const value = sensorDataGenerators[sensorType]();
    const payload = { esp_id: TEST_ESP_ID, sensors: [{ type: sensorType, pin, value }] };
    console.log(`\n============================================================`);
    console.log(`[TESTE HTTP] Sensor: ${sensorType}, Pino: ${pin}`);
    console.log(`============================================================`);
    try {
      console.log(`\n1. Enviando POST para /dados...`);
      const postResponse = await axios.post(`${API_URL}/dados`, payload);
      if (postResponse.status !== 201) {
        console.error(`   [FALHA NO POST] Status inesperado: ${postResponse.status}.`);
        continue;
      }
      console.log(`   [SUCESSO NO POST] Status: ${postResponse.status}`);

      console.log(`\n2. Verificando dados com GETs...`);
      const endpoints = [`/sensores/${sensorType}`, `/sensores/${sensorType}/${TEST_ESP_ID}`, `/sensores/${sensorType}/pin/${pin}`, `/sensores/${sensorType}/pin/${pin}/${TEST_ESP_ID}`];
      for (const endpoint of endpoints) {
        const getResponse = await axios.get(`${API_URL}${endpoint}`);
        console.log(`   - GET ${endpoint} -> Status ${getResponse.status}. Encontrados ${getResponse.data.length} registros.`);
      }
    } catch (err) {
      console.error(`\n[ERRO NO TESTE HTTP] Para ${sensorType}: ${err.message}`);
    }
  }
}

async function runMqttTest() {
  console.log(`\n============================================================`);
  console.log(`[INICIANDO TESTE MQTT]`);
  console.log(`============================================================`);

  return new Promise((resolve, reject) => {
    const client = mqtt.connect(`mqtt://${MQTT_BROKER}`);

    client.on('connect', () => {
      console.log(`Conectado ao broker MQTT: ${MQTT_BROKER}`);

      // // 1. Mensagem para o script Python ver
      const pythonMessage = 'Teste do script test_endpoints.js!';
      client.publish(MQTT_TOPICO_PARA_PYTHON_SCRIPT, pythonMessage, (err) => {
        if (err) {
          console.error(`Erro ao publicar para o tópico do Python: ${err}`);
        } else {
          console.log(`📤 Mensagem enviada para o script Python em '${MQTT_TOPICO_PARA_PYTHON_SCRIPT}': "${pythonMessage}"`);
        }
      });

      // 2. Mensagem com payload de sensor para o backend processar
      const sensorType = 'TEMP';
      const pin = 99;
      const value = sensorDataGenerators[sensorType]();
      const backendPayload = { esp_id: 'esp1', sensors: [{ type: sensorType, pin, value }] };
      const backendMessage = JSON.stringify(backendPayload);
      client.publish(MQTT_TOPICO_PARA_BACKEND, backendMessage, (err) => {
        if (err) {
          console.error(`Erro ao publicar para o tópico do backend: ${err}`);
        } else {
          console.log(`📤 Payload enviado para o backend em '${MQTT_TOPICO_PARA_BACKEND}': ${backendMessage}`);
        }
        
        // Encerrar a conexão e finalizar o teste
        client.end();
      });
    });

    client.on('end', () => {
      console.log('Cliente MQTT desconectado.');
      resolve();
    });

    client.on('error', (err) => {
      console.error("Erro no cliente MQTT:", err);
      client.end();
      reject(err);
    });
  });
}

(async () => {
  try {
    await runHttpTests();
    await runMqttTest();
  } catch (e) {
     console.error(`\n[ERRO GERAL] Não foi possível executar os testes.`);
     console.error(`Verifique se os serviços (backend, broker) estão rodando.`);
     console.error(`Detalhes: ${e.message}`);
  }
  console.log(`\n============================================================`);
  console.log('Todos os testes finalizados.');
  console.log(`============================================================`);
})();
