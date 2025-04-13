#include <stdlib.h>
#include <stdio.h>
#include <limits.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

struct llnode {
    int item;
    struct llnode *next;
};
  
struct llist {
    struct llnode *front;
};

// linked_sum(ll) finds the sum of all items stored in the linked list
// requires: ll is a valid llist
// time: O(n)
// examples: 1-2-3-4   ->    10
int linked_sum(struct llist *ll) {
    // Your implementation here

    return 0;
}