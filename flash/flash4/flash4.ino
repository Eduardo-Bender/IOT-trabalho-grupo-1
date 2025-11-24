
#include "../lib/pin_to_write.h"

PinToWrite pin_to_write;

#define ID_MQTT "ESP4GRUPOGAMER"
#define TOPICO_SUBSCRIBE "grupo1/4/subscribe"
#include "../lib/mqtt.h"

#define LED_AMARELO 13
#define LED_VERMELHO 12
#define LED_VERDE 15

void setup()
{
  Serial.begin(9600);
  setupMqtt();
  pin_to_write.add_pin(LED_VERDE);
  pin_to_write.add_pin(LED_AMARELO);
  pin_to_write.add_pin(LED_VERMELHO); 
}

bool has_changed = false;
unsigned long cur_time = 0;

String mensagem;
char msg[100];

void loop()
{
  mqttLoop();
  
  mensagem = getMensagemMqtt();
  mensagem.toCharArray(msg, mensagem.length() + 1);

  cur_time = millis();
  if(strlen(msg) >0)
  {
    pin_to_write.process(msg, cur_time);
  }
  pin_to_write.check_pin_timeouts(cur_time);
}

