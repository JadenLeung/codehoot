#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

struct stack {
  int len;
  int maxlen;
  int *data;
};

struct stack *create_stack(void) {
  struct stack *s = malloc(sizeof(struct stack));
  s->len = 0;
  s->maxlen = 1;
  s->data = malloc(s->maxlen * sizeof(int));
  return s;
}

// Time: O(1) [amortized]
void stack_push(int item, struct stack *s) {
  assert(s);
  if (s->len == s->maxlen) {
    s->maxlen *= 2;
    s->data = realloc(s->data, s->maxlen * sizeof(int));
  }
  s->data[s->len] = item;
  s->len += 1;
}

void stack_destroy(struct stack *s) {
  assert(s);
  free(s->data);
  free(s);
}

bool stack_is_empty(const struct stack *s) {
  assert(s);
  return s->len == 0;
}

int stack_top(const struct stack *s) {
  assert(s);
  assert(s->len);
  return s->data[s->len - 1];
}

int stack_pop(struct stack *s) {
  assert(s);
  assert(s->len);
  s->len -= 1;
  return s->data[s->len];
}


// stack_filter(s, filter) filters stack s so that only the desired items stay.
//   The function filter will return true for desired items and false otherwise
// requires: s and filter are not NULL
// effects: may modify the stack pointed to by s
// time: O(n)
// examples: s: -1    filter: is_odd   ->   s: -1
//               0                              1
//               1                             -3
//               2
//              -3
void stack_filter(struct stack *s, bool (*filter)(int)) {
    // Your implementation here
}
