#include <stdio.h>

#include "../lib/pin_to_write.h"

void setup()
{
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
}

void loop()
{
  process_pins_to_write("13,1");

  delay(3000);

  process_pins_to_write("13,0");
  //digitalWrite(13, 0);

  delay(3000);
}

