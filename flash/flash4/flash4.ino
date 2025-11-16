#include <stdio.h>

#include "../lib/pin_to_write.h"

PinToWrite pin_to_write;

void setup()
{
  Serial.begin(9600);  
  pin_to_write.add_pin(13);

  Serial.println("TESTE");
}

bool has_changed = false;
unsigned long cur_time = 0;

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
    pin_to_write.process("13, 1, 3000", cur_time);
    has_changed = true;
  }

  pin_to_write.check_pin_timeouts(cur_time);

  //pin_to_write.process("13, 1, 50000", millis());
  //digitalWrite(13, 1);
}

