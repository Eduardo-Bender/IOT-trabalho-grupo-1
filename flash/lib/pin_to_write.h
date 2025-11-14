#ifndef _PIN_TO_WRITE_H_
#define _PIN_TO_WRITE_H_

#include <string.h>
#include <stdio.h>
#include <stdlib.h>

int patoi(int cur, char c)
{
    cur *= 10;
    cur += c - '0';

    return cur;
}

void process_pins_to_write(char *str)
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

#endif // _PIN_TO_WRITE_H_
