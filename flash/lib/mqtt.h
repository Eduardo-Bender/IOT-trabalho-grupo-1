#include <WiFi.h> 
#include <PubSubClient.h>  
 
#define TOPICO_SUBSCRIBE "grupo1_subscribe_mqtt"
#define TOPICO_PUBLISH   "grupo1_publish_mqtt"  

#ifndef ID_MQTT
#define ID_MQTT  "Cliente"
#endif

const char* SSID = "Evil UFSM"; 
const char* PASSWORD = "senhanova";
  
const char* BROKER_MQTT = "broker.hivemq.com"; 
int BROKER_PORT = 1883;
static String mensagem_mqtt; 

WiFiClient espClient;
PubSubClient MQTT(espClient);

void setupMqtt(void);
void init_serial(void);
void init_wifi(void);
void init_mqtt(void);
void reconnect_wifi(void); 
void reconnect_mqtt(void);
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void verifica_conexoes_wifi_mqtt(void);
void mqttLoop(char*);
String getMensagemMqtt(void);

String getMensagemMqtt(void)
{
    return mensagem_mqtt;
}


void mqttLoop(char* msg = nullptr)
{
  verifica_conexoes_wifi_mqtt();
  MQTT.publish(TOPICO_PUBLISH, msg);
  MQTT.loop();
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
    mensagem_mqtt = "";
    String msg;
 
    //obtem a string do payload recebido
    for(int i = 0; i < length; i++) 
    {
       char c = (char)payload[i];
       msg += c;
    }
    mensagem_mqtt = msg;
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
