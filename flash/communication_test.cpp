#include <stdio.h>
#include <cstdio>
#include <string.h>

using namespace std;

char json[1000];

void append_string_to_json(char *str)
{
    int idx = strlen(json);
    for (int i = 0; i < strlen(str); i++)
    {
        json[idx] = str[i];
        idx++;
    }

    json[idx] = 0;
}

void create_json(int esp_id)
{
    sprintf(json, "{ \"esp_id\": %d", esp_id);
}

void append_temperature_data(int pin, float temperature)
{
    char aux[500];
    sprintf(aux, ", \"sensor_1\": { \"pin\": %d, \"value\": %f}", pin, temperature);
    append_string_to_json(aux);
}

int main()
{
    create_json(10);
    append_temperature_data(10, 15.4);

    printf("%s\n", json);

    return 0;
}
