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

// middle(ll) returns the middle value of a linked list. In the case that the
//   number of nodes is even and there are two middle values, the average of
//   the two middles (with integer division) should be returned
// requires: ll is a valid linked list with atleast one node
// time: O(n)
// examples: 1 - 2 - 3   ->   2
//           5 - 4 - 7 - 2   ->  (4 + 7) / 2 = 5
int middle(struct llist *ll) {
    // Your implementation here
    return 0;
}