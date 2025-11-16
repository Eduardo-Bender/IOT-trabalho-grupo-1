
#include "../lib/pin_to_write.h"

PinToWrite pin_to_write;

#define LED_AMARELO 12
#define LED_VERMELHO 13
#define LED_VERDE 14

void setup()
{
  pin_to_write.add_pin(LED_VERDE);
  pin_to_write.add_pin(LED_AMARELO);
  pin_to_write.add_pin(LED_VERMELHO); 
}

bool has_changed = false;
unsigned long cur_time = 0;

char msg[] = "13, 1, 0";

void loop()
{
  cur_time = millis();

  if (!has_changed)
  {
    pin_to_write.process(msg, cur_time);
    has_changed = true;
  }

  pin_to_write.check_pin_timeouts(cur_time);
}

