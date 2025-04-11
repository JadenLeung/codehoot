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

// create_calculator() initializes memory for a new calculator
// effects: allocates memory, caller must free
struct calculator *create_calculator(int max);

// destroy_calculator(c) destroys a calculator
// requires: c is not NULL
// effects: frees memory
void destroy_calculator(struct calculator *c);

// get_answer(c) returns the answer stored in c
// requires: c is not NULL
int get_answer(struct calculator *c);

// add(n, c) adds n to the answer stored in c. If the new answer is greater
//   c->max or less than -c->max the answer should be limited by 'wrapping' around
// requires: c is not NULL
// effects: may modify *c
// examples: c->max = 100, c->answer = 0, n = 100    ->   c->answer = 100
//           c->max = 100, c->answer = 100, n = 1    ->   c->answer = -100
void add(int n, struct calculator *c);

// subtract(n, c) subtracts n to the answer stored in c. If the new answer is greater
//   c->max or less than -c->max the answer should be limited by 'wrapping' around
// requires: c is not NULL
// effects: may modify *c
void subtract(int n, struct calculator *c);



