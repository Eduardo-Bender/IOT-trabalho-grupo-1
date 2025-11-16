
#include "../lib/pin_to_write.h"

PinToWrite pin_to_write;

#define LED_VERDE 11
#define LED_AMARELO 12
#define LED_VERMELHO 13

void setup()
{
  //pin_to_write.add_pin(LED_VERDE);
  pin_to_write.add_pin(LED_AMARELO);
  pin_to_write.add_pin(LED_VERMELHO);
}

bool has_changed = false;
unsigned long cur_time = 0;

char msg[] = "13, 1, 3000";

void loop()
{
  cur_time = millis();
  /*pin_to_write.process("13, 1, 0");

  delay(3000);

  pin_to_write.process("13, 0, 0");
  //digitalWrite(13, 0);

  delay(3000);*/

  if (!has_changed)
  {
    //digitalWrite(13,  1);
    pin_to_write.process(msg, cur_time);
    has_changed = true;
  }

  pin_to_write.check_pin_timeouts(cur_time);

  //pin_to_write.process("13, 1, 50000", millis());
  //digitalWrite(13, 1);
}

