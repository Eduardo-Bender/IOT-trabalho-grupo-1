/// ESP 1 - Capturar senha e fornecer resposta tátil
/// Bibliotecas necessárias:
/// - Keypad by Mark Stanley, Alexander Brevig (v3.1.1+)

#include <stdio.h>

#define ID_MQTT "ESP1"
#define ARDUINO_ID 3
#define PIN_MOTOR 21

#define PASSWORD_MAX_SIZE 10

#include "../lib/mqtt.h"
#include "../lib/Json.h"
#include "../lib/PinToWrite.h"
#include <Keypad.h>

const byte rows = 4;
const byte cols = 4;

byte colPins[cols] = {2, 15, 13, 12};
byte rowPins[rows] = {32, 33, 25, 26};

char keys[rows][cols] = {
  {'1','2','3', 'a'},
  {'4','5','6', 'b'},
  {'7','8','9', 'c'},
  {'#','0','*', 'd'}
};

void keypadLoop(void);

Json json(ARDUINO_ID);
PinToWrite pin_to_write;

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, rows, cols);
unsigned long cur_time;

char password[PASSWORD_MAX_SIZE + 1];
int idx_password = 0;

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
  cur_time = millis();
  
  if (should_send_password)
  {
    mqttLoop(password);
    should_send_password = false;
  }

  keypadLoop();

  /// pin_to_write_msg = mqtt() RECEBE
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
    /// finaliza senha atual
    password[idx_password] = '\0';
    should_send_password = true;
  }
  else
  {
    /// add caractere na senha
    password[idx_password] = key;
    idx_password = (idx_password + 1) % (PASSWORD_MAX_SIZE + 1);
  }
}
