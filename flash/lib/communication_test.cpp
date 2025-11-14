#include <stdio.h>

#include "Json.h"
#include "pin_to_write.h"

using namespace std;

int main()
{
    Json json(10);

    json.append_keypad_string(10, "1234");

    printf("%s\n\n", json.get_json());

    json.reset();

    json.append_humidity_temperature_data(5, 15, 25);

    printf("%s\n\n", json.get_json());

    process_pins_to_write("10,  5,    4,4,4");

    return 0;
}
