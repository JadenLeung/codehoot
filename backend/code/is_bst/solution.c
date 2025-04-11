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

bool is_node(struct btnode *node, int min, int max) {
    if (node == false) {
        return true;
    }
    if (node->item < min || node->item > max) {
        return false;
    }
    return is_node(node->left, min, node->item) && is_node(node->right, node->item, max);
}
bool is_bst(struct bt *bt) {
    assert(bt);
    return is_node(bt->root, INT_MIN, INT_MAX);
}
