#include "stack_filter.h"

bool is_even(int n) {
    if (n % 2 == 0) {
        return true;
    }
    return false;
}

bool is_odd(int n) {
    return !is_even(n);
}

bool always_true(int n) {
    return true;
}

bool always_false(int n) {
    return false;
}

bool is_positive(int n) {
    if (n > 0) {
        return true;
    }
    return false;
}

int main(void) {
    struct stack *s = create_stack();
    int read = 0;
    while (scanf("%d", &read) == 1) {
        stack_push(read, s);
    }
    char filter = '\0';
    if (scanf("%c", &filter) != 1) {
        stack_filter(s, NULL);
        return 0;
    }

    if (filter == 'e') {
        stack_filter(s, &is_even);    
    } else if (filter == 'o') {
        stack_filter(s, &is_odd);    
    } else if (filter == 't') {
        stack_filter(s, &always_true);    
    } else if (filter == 'f') {
        stack_filter(s, &always_false);    
    } else if (filter == 'p') {
        stack_filter(s, &is_positive);    
    } else {
        stack_filter(NULL, &always_false);
        return 0;
    }
    printf("Stack:\n");
    while (!stack_is_empty(s)) {
        printf("%d\n", stack_pop(s));
    }
    stack_destroy(s);
}