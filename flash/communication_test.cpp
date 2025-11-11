#include <stdio.h>
#include <cstdio>
#include <string.h>
#include <stdbool.h>
#include <stdarg.h>

using namespace std;

char json[1000];
bool has_appended_sensor;

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
    sprintf(json, "{ \"esp_id\": %d, \"sensors\": [", esp_id);
    has_appended_sensor = false;
}

char* get_json()
{
    append_string_to_json("]}");
    return json;
}

void check_comma_before_sensor()
{
    if (has_appended_sensor)
    {
        append_string_to_json(", ");
    }

    has_appended_sensor = true;
}

void append_data(char* type, int pin, int arg_count, ...)
{
    char aux[100];
    char values[50] = "";

    va_list args;
    va_start(args, arg_count);

    if (arg_count == 1)
    {
        sprintf(values, "%f", va_arg(args, double));
    }
    else
    {
        float f_value;
        char s_value[10];

        strcat(values, "[");

        for (int i = 0; i < arg_count; i++)
        {
            f_value = va_arg(args, double);
            sprintf(s_value, "%f", f_value);
            strcat(values, s_value);

            if (i < arg_count - 1)
            {
                strcat(values, ", ");
            }
        }

        strcat(values, "]");
    }

    sprintf(aux, "{\"type\": \"%s\", \"pin\": %d, \"value\": %s}", type, pin, values);
    append_string_to_json(aux);

    va_end(args);
}

void append_temperature_data(int pin, float temperature)
{
    check_comma_before_sensor();
    append_data("TEMP", pin, 1, temperature);
}

int main()
{
    create_json(10);
    append_temperature_data(10, 15);
    append_temperature_data(15, 50);

    printf("%s\n", get_json());

    return 0;
}
