/// PENDENCIAS PARA RODAR ESSA JOÇA
/// INSTALE ATRAVES DO LIBRARY MANAGER DO ARDUINO IDE AS SEGUINTES COISAS
/// - DHT11 by Dhruba Saha (v2.1.0+)
/// - Ultrasonic by Erick Simões (v3.0.0+)
/// - Keypad by Mark Stanley, Alexander Brevig (v3.1.1+)
/// - PubSubClient by Nick O'Leary (v2.8+)
/// - IRremote by shirriff, z3t0, ArminJo (v4.5.0+)



#include <stdio.h>
//----------------------------------------------------------
// PINOS
#define analogTempPin A0
#define velocidadePin 2
// PINOS DO KEYPAD LA EM BAIXO NA SECAO DO KEYPAD
#define dht11pin 15
#define relePin 17
#define somTriggerPin 21
#define somEchoPin 22
int RECV_PIN = 22;                          // Arduino pino D11 conectado no Receptor IR

//----------------------------------------------------------
// WIFI
#include <WiFi.h> 
#include <PubSubClient.h>  
 
#define TOPICO_SUBSCRIBE "grupo1_subscribe_mqtt"
#define TOPICO_PUBLISH   "grupo1_publish_mqtt"  
#define ID_MQTT  "Cliente"
const char* SSID = "Evil UFSM"; 
const char* PASSWORD = "cucucucu"; 
  
const char* BROKER_MQTT = "broker.hivemq.com"; 
int BROKER_PORT = 1883;
 
WiFiClient espClient;
PubSubClient MQTT(espClient);

void setupMqtt(void);
void init_serial(void);
void init_wifi(void);
void init_mqtt(void);
void reconnect_wifi(void); 
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void verifica_conexoes_wifi_mqtt(void);
void mqttLoop(void);

//----------------------------------------------------------
// IREMOTE
#include <IRremote.h>                       // Biblioteca IRemote
IRrecv irrecv(RECV_PIN);                    // criando a instância
decode_results results;                     // declarando os resultados

void loop_ir(void);

//----------------------------------------------------------
// DHT11
#include <DHT11.h>
DHT11 dht11(dht11pin);
float temperatura;
float umidade;

void dht11Loop(void);

//----------------------------------------------------------
// Sensor Infravermelho de movimento
int contagemVel = 0;
int leituraVel;

void velocidadeLoop(void);

//----------------------------------------------------------
// Keypad
#include <Keypad.h>
const byte rows = 4;
const byte cols = 4;
byte colPins[cols] = {9, 8, 7, 6};
byte rowPins[rows] = {13, 12, 11, 10};
char keys[rows][cols] = {
  {'1','2','3', 'a'},
  {'4','5','6', 'b'},
  {'7','8','9', 'c'},
  {'#','0','*', 'd'}
};

Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, rows, cols );

void numpadLoop(void);

//----------------------------------------------------------
// Sensor de temperatura analogico
int valTemp= 0;
double voltsTemp = 0;

void temperaturaLoop(void);

//----------------------------------------------------------
// Sensor de distancia ultrassonico
#include <Ultrasonic.h>
Ultrasonic ultrasonic(somTriggerPin, somEchoPin, 40000UL);

void somLoop(void);

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
 
void setup() {
  Serial.begin(9600);
  //setupMqtt();
  pinMode(velocidadePin, INPUT);
  pinMode(relePin, OUTPUT);
  digitalWrite(relePin, HIGH);

  irrecv.enableIRIn();
}

void loop() {
  mqttLoop();
  velocidadeLoop();
  dht11Loop();
  //temperaturaLoop();
  // somLoop();
  // displayLoop();
  // botaoLoop();
  // numpadLoop();
  loop_ir();

  delay(300);
}

void mqttLoop()
{
  //verifica_conexoes_wifi_mqtt();
  //MQTT.publish(TOPICO_PUBLISH, "ESP32 se comunicando com MQTT");
  //MQTT.loop();
}

/* Função: verifica o estado das conexões WiFI e ao broker MQTT. 
 *         Em caso de desconexão (qualquer uma das duas), a conexão
 *         é refeita.
 * Parâmetros: nenhum
 * Retorno: nenhum
 */
void verifica_conexoes_wifi_mqtt(void)
{
    /* se não há conexão com o WiFI, a conexão é refeita */
    reconnect_wifi(); 
    /* se não há conexão com o Broker, a conexão é refeita */
    if (!MQTT.connected()) 
        reconnect_mqtt(); 
} 

void setupMqtt() 
{
    init_wifi();
    init_mqtt();
}

void init_wifi(void) 
{
    delay(10);
    Serial.println("------Conexao WI-FI------");
    Serial.print("Conectando-se na rede: ");
    Serial.println(SSID);
    Serial.println("Aguarde");
    reconnect_wifi();
}

void init_mqtt(void) 
{
    /* informa a qual broker e porta deve ser conectado */
    MQTT.setServer(BROKER_MQTT, BROKER_PORT); 
    /* atribui função de callback (função chamada quando qualquer informação do 
    tópico subescrito chega) */
    MQTT.setCallback(mqtt_callback);            
}
  
void mqtt_callback(char* topic, byte* payload, unsigned int length) 
{
    String msg;
 
    //obtem a string do payload recebido
    for(int i = 0; i < length; i++) 
    {
       char c = (char)payload[i];
       msg += c;
    }
    Serial.print("[MQTT] Mensagem recebida: ");
    Serial.println(msg);     
}
  
void reconnect_mqtt(void) 
{
    while (!MQTT.connected()) 
    {
        Serial.print("* Tentando se conectar ao Broker MQTT: ");
        Serial.println(BROKER_MQTT);
        if (MQTT.connect(ID_MQTT)) 
        {
            Serial.println("Conectado com sucesso ao broker MQTT!");
            MQTT.subscribe(TOPICO_SUBSCRIBE); 
        } 
        else
        {
            Serial.println("Falha ao reconectar no broker.");
            Serial.println("Havera nova tentatica de conexao em 2s");
            delay(2000);
        }
    }
}
  
void reconnect_wifi() 
{
    /* se já está conectado a rede WI-FI, nada é feito. 
       Caso contrário, são efetuadas tentativas de conexão */
    if (WiFi.status() == WL_CONNECTED)
        return;
         
    WiFi.begin(SSID, PASSWORD);
     
    while (WiFi.status() != WL_CONNECTED) 
    {
        delay(100);
        Serial.print(".");
    }
   
    Serial.println();
    Serial.print("Conectado com sucesso na rede ");
    Serial.print(SSID);
    Serial.println("IP obtido: ");
    Serial.println(WiFi.localIP());
}
 
void loop_ir()
{
  if (irrecv.decode(&results))              // se algum código for recebido
  {
    Serial.println(results.value, HEX);     // imprime o HEX Code
    irrecv.resume();                        // reinicializa o receptor
    delay(10);                              // atraso de 10 ms
  }
}

void velocidadeLoop()
{
  leituraVel = digitalRead(velocidadePin); 
  if ( leituraVel == 1) { 
    contagemVel++; 
    Serial.print("Numero de deteccoes: ");
    Serial.println(contagemVel);
  }
}

void dht11Loop()
{
  temperatura = dht11.readTemperature();
  umidade = dht11.readHumidity();
  Serial.print("Temperatura: ");
  Serial.println(temperatura);
  Serial.print("Umidade: ");
  Serial.println(umidade);
}

void numpadLoop()
{
  char key = keypad.getKey();

  if (key != NO_KEY){
    //Serial.println(key);
  }
}

void somLoop(){
  float cmMsec, inMsec;
  cmMsec = ultrasonic.read(CM);
  inMsec = ultrasonic.read(INC);

  Serial.print("Distancia em cm: ");
  Serial.print(cmMsec);
  Serial.println();
}

void temperaturaLoop() {  
  valTemp = analogRead(analogTempPin); 
  voltsTemp = map(valTemp, 0, 1023, 0, 3300);
  Serial.println((voltsTemp-500) * 0.1, 1);
}