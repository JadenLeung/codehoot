#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

struct calculator {
    int answer;
    int max;
};

struct calculator *create_calculator(int max) {
    struct calculator *c = malloc(sizeof(struct calculator));
    c->answer = 0;
    c->max = max;
    return c;
}

void destroy_calculator(struct calculator *c) {
    assert(c);
    free(c);
}

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

void add(int n, struct calculator *c) {
    assert(c);
    c->answer = limit(c->max, c->answer + n);
}

void subtract(int n, struct calculator *c) {
    assert(c);
    add(-n, c);
}