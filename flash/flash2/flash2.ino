
#define ID_MQTT "ESP2"
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
  //setupMqtt();

  pin_to_write.add_pin(PIN_RELE);
  pinMode(PIN_ENCODER, INPUT_PULLUP);
}

char pin_to_write_msg[20] = "";
unsigned long cur_time = 0;
unsigned long time_door_opened = 0;

bool door_is_open = false;

bool has_sent_alert_msg = false;
bool has_sent_OK_msg = true;

bool max_time_exceeded()
{
  return (cur_time - time_door_opened) >= MAX_TIME_DOOR_OPEN_MS;
}

void loop()
{
  cur_time = millis();

  /// pin_to_write_msg = mqtt() RECEBE
  /*pin_to_write.process(pin_to_write_msg, cur_time);/**/

  /// PORTA ABRIU
  if (!door_is_open && digitalRead(PIN_ENCODER))
  {
    time_door_opened = cur_time;
    door_is_open = true;
  }

  /// PORTA FECHOU
  if (!digitalRead(PIN_ENCODER))
  {
    door_is_open = false;

    if (!has_sent_OK_msg)
    {
      json.reset();
      json.append_alert(PIN_ENCODER, 0);

      /// ENVIAR MQTT
      Serial.println(json.get_json());
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

      /// ENVIAR MQTT
      Serial.println(json.get_json());
    }

    has_sent_alert_msg = true;
    has_sent_OK_msg = false;
  }
}
