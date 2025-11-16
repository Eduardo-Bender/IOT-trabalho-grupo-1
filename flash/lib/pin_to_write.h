#ifndef _PIN_TO_WRITE_H_
#define _PIN_TO_WRITE_H_

#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "Pin.h"

struct PinToWrite
{
private:

    static char const max_pin = 5;
    char pin_count = 0;

    Pin pins[max_pin];

    int patoi(int cur, char c)
    {
        cur *= 10;
        cur += c - '0';

        return cur;
    }

    int get_pin_idx(char pin)
    {
        for (int i = 0; i < pin_count; i++)
        {
            if (pin == pins[i].pin)
            {
                return i;
            }
        }

        return -1;
    }

public:

    PinToWrite()
    {

    }

    void add_pin(char pin)
    {
        if (pin_count == max_pin)
        {
            return;
        }

        pins[pin_count].define_pin(pin);
        pin_count++;
    }

    void process(char *str, unsigned long cur_time)
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

        for (int i = 0; i + 2 < values_count; i += 3)
        {
            int pin = values[i];
            int value = values[i + 1];
            int time = values[i + 2];

            //printf("pin: %d  - values: %d  - time: %d\n", pin, value, time);

            int idx = get_pin_idx(pin);

            if (idx == -1)
            {
                continue;
            }

            pins[idx].set_pin(value, cur_time, time);
        }
    }

    void check_pin_timeouts(unsigned long cur_time)
    {
        for (int i = 0; i < pin_count; i++)
        {
            pins[i].check_if_should_turn_off(cur_time);
        }
    }
};

#endif // _PIN_TO_WRITE_H_
