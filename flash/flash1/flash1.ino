/// ESP 1 - Capturar senha e fornecer resposta tátil
/// Bibliotecas necessárias:
/// - Keypad by Mark Stanley, Alexander Brevig (v3.1.1+)

#include <stdio.h>

#define ID_MQTT "ESP1GRUPOGAMER"
#define TOPICO_SUBSCRIBE "grupo1/1/subscribe"
#define ARDUINO_ID 1
#define PIN_MOTOR 21

#define PASSWORD_MAX_SIZE 30

#include "../lib/mqtt.h"
#include "../lib/Json.h"
#include "../lib/pin_to_write.h"
#include <Keypad.h>

const byte rows = 4;
const byte cols = 4;

byte colPins[cols] = {2, 15, 13, 12};
byte rowPins[rows] = {32, 33, 25, 26};

char keys[rows][cols] = {
  {'1','2','3', 'a'},
  {'4','5','6', 'b'},
  {'7','8','9', 'c'},
  {'*','0','#', 'd'}
};

void keypadLoop(void);

Json json(ARDUINO_ID);
PinToWrite pin_to_write;

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, rows, cols);
unsigned long cur_time;

char password[PASSWORD_MAX_SIZE];
int idx_password = 0;

String mensagem;
bool should_send_password;
char pin_to_write_msg[20] = "";

void setup()
{
  Serial.begin(9600);
  setupMqtt();

  pin_to_write.add_pin(PIN_MOTOR);
  should_send_password = false;
}

void loop()
{
  keypadLoop();

  cur_time = millis();

  mensagem = getMensagemMqtt();
  mensagem.toCharArray(pin_to_write_msg, mensagem.length() + 1);
 
  if (should_send_password)
  {
    mqttLoop(json.get_json());
    should_send_password = false;
    Serial.println(json.get_json());
  } else {
    mqttLoop("");
  }

  pin_to_write.process(pin_to_write_msg, cur_time);
  pin_to_write.check_pin_timeouts(cur_time);
}

void keypadLoop()
{
  char key = keypad.getKey();

  if (key == NO_KEY)
  {
    return;
  }
  
  Serial.print("Tecla pressionada: ");
  Serial.print(key);
  Serial.println();

  if (key == '*')
  {
    /// nova senha
    idx_password = 0;
  }
  else if (key == '#')
  {
    json.reset();

    /// finaliza senha atual
    password[idx_password] = '\0';
    should_send_password = true;

    json.append_keypad_string(2, password);
  }
  else
  {
    /// add caractere na senha
    password[idx_password] = key;
    idx_password = (idx_password + 1) % PASSWORD_MAX_SIZE;
  }
}
