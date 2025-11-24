
#define ID_MQTT "ESP2GRUPOGAMER"
#define TOPICO_SUBSCRIBE "grupo1/2/subscribe"
#define ARDUINO_ID 2

#define PIN_RELE 12
#define PIN_ENCODER 13

#define MAX_TIME_DOOR_OPEN_MS 5000

#include "../lib/mqtt.h"
#include "../lib/Json.h"
#include "../lib/pin_to_write.h"

Json json(ARDUINO_ID);
PinToWrite pin_to_write;

void setup()
{
  Serial.begin(9600);
  setupMqtt();

  pin_to_write.add_pin(PIN_RELE);
  pinMode(PIN_ENCODER, INPUT_PULLUP);
}

String mensagem;
char msg[100];

bool should_send_msg = false;
bool has_sent_alert_msg = false;
bool has_sent_OK_msg = true;

unsigned long cur_time = 0;
unsigned long time_door_opened = 0;

bool door_is_open = false;

bool max_time_exceeded()
{
  return (cur_time - time_door_opened) >= MAX_TIME_DOOR_OPEN_MS;
}

bool door_is_open_pin()
{
  return digitalRead(PIN_ENCODER);
}

void loop()
{
  cur_time = millis();

  /// PORTA ABRIU
  if (!door_is_open && door_is_open_pin())
  {
    time_door_opened = cur_time;
    door_is_open = true;
  }

  /// PORTA FECHOU
  if (!door_is_open_pin())
  {
    door_is_open = false;

    if (!has_sent_OK_msg)
    {
      json.reset();
      json.append_alert(PIN_ENCODER, 0);
      should_send_msg = true;
    }

    has_sent_OK_msg = true;
    has_sent_alert_msg = false;
  }

  /// TEMPO DA PORTA ABERTA PASSOU DO LIMITE
  if (door_is_open && max_time_exceeded())
  {
    if (!has_sent_alert_msg)
    {
      json.reset();
      json.append_alert(PIN_ENCODER, 1);
      should_send_msg = true;
    }

    has_sent_alert_msg = true;
    has_sent_OK_msg = false;
  }

  if (should_send_msg)
  {
    mqttLoop(json.get_json());
    should_send_msg = false;
  }
  else
  {
    mqttLoop("");
  }

  mensagem = getMensagemMqtt();
  mensagem.toCharArray(msg, mensagem.length() + 1);

  if(strlen(msg) > 0)
  {
    pin_to_write.process(msg, cur_time);
  }

  pin_to_write.check_pin_timeouts(cur_time);
}
