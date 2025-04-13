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


void stack_filter(struct stack *s, bool (*filter)(int)) {
    assert(s);
    assert(filter);
    
    struct stack *temp = create_stack();
    while (!stack_is_empty(s)) {
        int top = stack_pop(s);
        if (filter(top)) {
            stack_push(top, temp);
        }
    }
    while (!stack_is_empty(temp)) {
        stack_push(stack_pop(temp), s);
    }
    stack_destroy(temp);
}