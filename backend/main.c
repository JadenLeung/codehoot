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
int main(void) {
    int read = 0;
    struct llist ll = {0};
    while (scanf("%d", &read) == 1) {
        
        struct llnode *new_node = malloc(sizeof(struct llnode));
        new_node->item = read;
        new_node->next = ll.front;
        ll.front = new_node;
    }

    if (scanf("%d", &read) == 0) {
        middle(NULL);
        return 0;
    }

    printf("Middle: %d\n", middle(&ll));
    while (ll.front) {
        struct llnode *temp = ll.front;
        ll.front = ll.front->next;
        free(temp);
    }
}

