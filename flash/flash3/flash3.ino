/// ESP 3 - Sensor de Umidade e Temperatura
/// Bibliotecas necessárias:
/// - DHT11 by Dhruba Saha (v2.1.0+)

#include <stdio.h>

#define ID_MQTT "ESP3"

#include "../lib/mqtt.h"
#include "../lib/Json.h"

#include <DHT11.h>

#define dht11pin 15
#define ARDUINO_ID 3

//#define LED_AMARELO 2

//#define MAX_TEMP 30

DHT11 dht11(dht11pin);
Json json(ARDUINO_ID);

float temperatura;
float umidade;

void dht11Loop(void);

void setup()
{
  Serial.begin(9600);
  setupMqtt();
  dht11.setDelay(50);
  //pinMode(LED_AMARELO, OUTPUT);
  //digitalWrite(LED_AMARELO, LOW);
}

void loop()
{
  json.reset();
  dht11Loop();
  
  mqttLoop(json.get_json());

  /*if (temperatura > MAX_TEMP) {
  digitalWrite(LED_AMARELO, HIGH); // Acende o LED
  } else {
    digitalWrite(LED_AMARELO, LOW); // Apaga o LED
  }*/


  delay(1000); // 1 Segundo
}

void dht11Loop()
{
  temperatura = dht11.readTemperature();
  umidade = dht11.readHumidity();
  if(temperatura == DHT11::ERROR_TIMEOUT || umidade == DHT11::ERROR_TIMEOUT)
  {
    return;
  }

  json.append_humidity_temperature_data(dht11pin, umidade, temperatura);

  Serial.print("Temperatura: ");
  Serial.println(temperatura);
  Serial.print("Umidade: ");
  Serial.println(umidade);
}