#include "linked_sum.h"

// See .h for details
int linked_sum(struct llist *ll) {
    assert(ll);

    struct llnode *node = ll->front;
    int sum = 0;
    while (node) {
        sum += node->item;
        node = node->next;
    }
    return sum;
}