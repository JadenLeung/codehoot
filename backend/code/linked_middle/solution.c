#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>

struct llnode {
  int item;
  struct llnode *next;
};

struct llist {
  struct llnode *front;
};

// length(node) finds the number of nodes that come after node (including node)
//   requires: node is not NULL
// time: O(n)
static int length(struct llnode *node) {
    assert(node);
    if (node->next == NULL) {
        return 1;
    } else {
        return 1 + length(node->next);
    }
}


// See .h for details
int middle(struct llist *ll) {
    assert(ll);
    assert(ll->front);

    int count = length(ll->front);
    int half = (count - 1) / 2;

    struct llnode *node = ll->front;
    for (int i = 0; i < half; i++) {
        node = node->next;
    }

    if (count % 2 == 0) {
        return (node->item + node->next->item) / 2;
    } else {
        return node->item;
    }
}