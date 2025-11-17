#ifndef _JSON_H_
#define _JSON_H_

#include <string.h>
#include <stdbool.h>
#include <stdarg.h>
#include <cstdio>

struct Json
{
private:

    char json[1000];
    bool has_appended_sensor;
    int esp_id;

    void check_comma_before_sensor()
    {
        if (has_appended_sensor)
        {
            strcat(json, ", ");
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
        strcat(json, aux);

        va_end(args);
    }

public:

    Json()
    {

    }

    Json(int esp_id)
    {
       this->esp_id = esp_id;
       reset();
    }

    void reset()
    {
        sprintf(json, "{ \"esp_id\": %d, \"sensors\": [", esp_id);
        has_appended_sensor = false;
    }

    void append_temperature_data(int pin, float temperature)
    {
        check_comma_before_sensor();
        append_data("TEMP", pin, 1, temperature);
    }

    void append_humidity_temperature_data(int pin, float humidity, float temperature)
    {
        check_comma_before_sensor();
        append_data("UMIDADE_TEMPERATURA", pin, 2, humidity, temperature);
    }

    void append_keypad_string(int pin, char str[30])
    {
        check_comma_before_sensor();

        char aux[80];
        sprintf(aux, "{\"type\": \"%s\", \"pin\": %d, \"value\": \"%s\"}", "TECLADO", pin, str);
        strcat(json, aux);
    }

    char* get_json()
    {
        strcat(json, "]}");
        return json;
    }
};

#endif // _JSON_H_
