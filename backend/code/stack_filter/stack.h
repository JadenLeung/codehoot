#include <stdbool.h>

// the documentation is conspicuously absent
//  (sometimes this documentation is part of an assignment)

// stack.h (INTERFACE)

struct stack;

struct stack *create_stack(void);

bool stack_is_empty(const struct stack *s);

int stack_top(const struct stack *s);

int stack_pop(struct stack *s);

void stack_push(int item, struct stack *s);

void stack_destroy(const struct stack *s);