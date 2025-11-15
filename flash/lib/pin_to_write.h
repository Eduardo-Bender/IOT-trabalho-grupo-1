#ifndef _PIN_TO_WRITE_H_
#define _PIN_TO_WRITE_H_

#include <string.h>
#include <stdio.h>
#include <stdlib.h>

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
            digitalWrite(values[i], values[i + 1]);
            //printf("%d %d\n", values[i], values[i + 1]);
        }
    }
};

#endif // _PIN_TO_WRITE_H_
