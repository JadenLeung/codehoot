#include "limited_calculator.h"

// See .h for details
struct calculator *create_calculator(int max) {
    struct calculator *c = malloc(sizeof(struct calculator));
    c->answer = 0;
    c->max = max;
    return c;
}

// See .h for details
void destroy_calculator(struct calculator *c) {
    assert(c);
    free(c);
}

// See .h for details
int get_answer(struct calculator *c) {
    assert(c);

    return c->answer;
}

static int limit(int max, int answer) {
    if (answer > max) {
        int overflow = answer - max;
        return limit(max, -max + overflow - 1);
    } else if (answer < -max) {
        int overflow = answer + max;
        return limit(max, max + overflow + 1);
    } else {
        return answer;
    }
}

// See .h for details
void add(int n, struct calculator *c) {
    assert(c);
    c->answer = limit(c->max, c->answer + n);
}

// See .h for details
void subtract(int n, struct calculator *c) {
    assert(c);
    add(-n, c);
}