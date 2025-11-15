#ifndef _PIN_TO_WRITE_H_
#define _PIN_TO_WRITE_H_

#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct PinToWrite
{
private:

    int pins[10];
    int pin_count = 0;

    int patoi(int cur, char c)
    {
        cur *= 10;
        cur += c - '0';

        return cur;
    }

    bool check_if_pin_was_added(int pin)
    {
        for (int i = 0; i < pin_count; i++)
        {
            if (pin == pins[i])
            {
                return true;
            }
        }

        return false;
    }

public:

    PinToWrite()
    {

    }

    void add_pin(int pin)
    {
        pins[pin_count++] = pin;

        pinMode(pin, OUTPUT);
        digitalWrite(pin, LOW);

    }

    void process(char *str)
    {
        int values[15];
        int values_count = 0;

        int cur = 0;

        for (int i = 0; str[i] != '\0'; i++)
        {
            char c = str[i];

            if (c == ' ')
            {
                continue;
            }

            if (c == ',')
            {
                values[values_count++] = cur;
                cur = 0;
            }
            else
            {
                cur = patoi(cur, c);
            }
        }

        values[values_count++] = cur;

        for (int i = 0; i + 1 < values_count; i += 2)
        {
            int pin = values[i];
            int value = values[i + 1];
            int time = values[i + 2];

            if (!check_if_pin_was_added(pin))
            {
                continue;
            }

            if (time == 0)
            {
                digitalWrite(pin, value);
            }
            else /// TEM DURACAO
            {

            }
        }
    }
};

#endif // _PIN_TO_WRITE_H_
