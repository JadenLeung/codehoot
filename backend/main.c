#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

struct btnode {
    int item;
    struct btnode *left;
    struct btnode *right;
    int count;
};
  
struct bt {
    struct btnode *root;
};
  
// is_bst(bt) determines if the binary tree bt is a valid bst
//   (i.e, all nodes in left are smaller and all nodes in right are larger)
// requires: bt is valid
// time: O(n)
// examples:     1
//             /   \        ->    true
//            0     2
//
//               5
//             /   \       ->     false
//            4     3

bool is_bst(struct bt *bt) {
    // Your implementation here
    return true;
}
struct btnode *read_node() {
    int read = 0;
    if (scanf("%d", &read) == 1) {
        struct btnode *new_node = malloc(sizeof(struct btnode));
        new_node->item = read;
        new_node->left = read_node();
        new_node->right = read_node();
        return new_node;
    } else {
        char dump = 0;
        scanf("%c", &dump);
        return NULL;
    }
}

void destroy_node(struct btnode *node) {
    if (node != NULL) {
        destroy_node(node->left);
        destroy_node(node->right);
        free(node);
    }
}

int main(void) {
    struct bt bt = {0};
    bt.root = read_node();
    char read = 0;
    
    if (bt.root == NULL && scanf("%c", &read) == 1) {
        is_bst(NULL);
        return 0;
    }
    bool retval = is_bst(&bt);
    
    if (retval == true) {
        printf("This tree is a bst\n");
    } else {
        printf("This tree is not a bst\n");
    }
    destroy_node(bt.root);
}