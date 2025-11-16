#include <stdio.h>

#define OUTPUT 0
#define LOW 0
#define HIGH 1

int pinMode(int a, int b)
{

}

void digitalWrite(int pin, int value)
{
    printf("Digital Write (pin %d): %d\n", pin, value);
}

#include "Json.h"
#include "pin_to_write.h"

using namespace std;

int main()
{
    /*Json json(10);

    json.append_keypad_string(10, "1234");

    printf("%s\n\n", json.get_json());

    json.reset();

    json.append_humidity_temperature_data(5, 15, 25);

    printf("%s\n\n", json.get_json());*/

    PinToWrite pin_to_write;

    pin_to_write.add_pin(10);
    pin_to_write.add_pin(11);
    pin_to_write.add_pin(12);

    pin_to_write.process("12, 1, 0, 10, 0, 2000, 8, 10, 20", 0);

    /*pin_to_write.process("10,1,1000", 0);
    pin_to_write.process("10,0,1000", 10);*/

    /*Pin p;
    p.define_pin(10);
    p.set_pin(1, 1000, 0);
    p.print_info();

    p.set_pin(0, 2000, 0);*/


    return 0;
}
