#include "stack_filter.h"

// See .h for details
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