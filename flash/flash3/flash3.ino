/// ESP 3 - Sensor de Umidade e Temperatura
/// Bibliotecas necessárias:
/// - DHT11 by Dhruba Saha (v2.1.0+)

#include <stdio.h>

#define ID_MQTT "ESP3GRUPOGAMER"

#include "../lib/mqtt.h"
#include "../lib/Json.h"

#include <DHT11.h>

#define dht11pin 15
#define ARDUINO_ID 3
#define SEND_WAIT_TIME_MS 1000

//#define LED_AMARELO 2

//#define MAX_TEMP 30

DHT11 dht11(dht11pin);
Json json(ARDUINO_ID);

void dht11Loop(void);

bool has_appended_data;
unsigned long cur_time;
unsigned long last_sent_time;

void setup()
{
  Serial.begin(9600);
  setupMqtt();
  dht11.setDelay(50);
  //pinMode(LED_AMARELO, OUTPUT);
  //digitalWrite(LED_AMARELO, LOW);

  last_sent_time = 0;
}

void loop()
{
  has_appended_data = false;

  cur_time = millis();

  if (cur_time >= last_sent_time + SEND_WAIT_TIME_MS)
  {
    json.reset();
    dht11Loop();

    last_sent_time = cur_time;
  }
  
  if (has_appended_data)
  {
    mqttLoop(json.get_json());
  } else {
    mqttLoop("");
  }
  

  /*if (temperatura > MAX_TEMP) {
  digitalWrite(LED_AMARELO, HIGH); // Acende o LED
  } else {
    digitalWrite(LED_AMARELO, LOW); // Apaga o LED
  }*/


  //delay(1000); // 1 Segundo
}

void dht11Loop()
{
  float temperatura = dht11.readTemperature();
  float umidade = dht11.readHumidity();

  if(temperatura == DHT11::ERROR_TIMEOUT || umidade == DHT11::ERROR_TIMEOUT)
  {
    return;
  }

  json.append_humidity_temperature_data(dht11pin, umidade, temperatura);
  has_appended_data = true;

  Serial.print("Temperatura: ");
  Serial.println(temperatura);
  Serial.print("Umidade: ");
  Serial.println(umidade);
}
