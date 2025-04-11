#include "stack.h"

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

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
void stack_filter(struct stack *s, bool (*filter)(int));