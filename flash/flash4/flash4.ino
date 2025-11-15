#include <stdio.h>

#include "../lib/pin_to_write.h"

PinToWrite pin_to_write;

void setup()
{
  pin_to_write.add_pin(13);
}

void loop()
{
  pin_to_write.process("13, 1, 0");

  delay(3000);

  pin_to_write.process("13, 0, 0");
  //digitalWrite(13, 0);

  delay(3000);
}

