#ifndef _PIN_H_
#define _PIN_H_

struct Pin
{
private:

    unsigned long last_time_changed;
    short wait_time;
    bool should_turn_off_after_wait_time;

    bool can_change(unsigned long cur_time)
    {
        //printf("can change: %d >= %d\n", last_time_changed + wait_time, cur_time);
        return wait_time == 0 || last_time_changed + wait_time <= cur_time;
    }

public:

    char pin;

    /*void print_info()
    {
        printf("\n\nlast_time: %d\n", last_time_changed);
        printf("wait_time: %d\n", wait_time);
        printf("should_wait: %d\n", should_turn_off_after_wait_time);
    }*/

    Pin()
    {
        last_time_changed = 0;
        wait_time = 0;
        should_turn_off_after_wait_time = false;
    }

    void define_pin(char pin)
    {
        this->pin = pin;

        pinMode(pin, OUTPUT);
        digitalWrite(pin, LOW);
    }

    void set_pin(int value, unsigned long cur_time, short wait_time)
    {
        //printf("\nSET PIN\n");
        //printf("cur_time: %d  cur_wait: %d\n", last_time_changed, this->wait_time);

        if (!can_change(cur_time))
        {
            return;
        }

        last_time_changed = cur_time;
        this->wait_time = wait_time;

        digitalWrite(pin, value);

        should_turn_off_after_wait_time = (wait_time != 0);
    }

    void check_if_should_turn_off(unsigned long cur_time)
    {
        if (!should_turn_off_after_wait_time)
        {
            return;
        }

        if (can_change(cur_time))
        {
            digitalWrite(pin, LOW);
            wait_time = 0;
            last_time_changed = cur_time;
        }
    }
};

#endif // _PIN_H_
