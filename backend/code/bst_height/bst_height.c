#include "bst_height.h"

// bst_node_height(node) finds the height of the tree rooted at node
// time: O(n)
int bst_node_height(struct bstnode *node) {
    if (node == NULL) {
        return 0;
    }
    int left = bst_node_height(node->left);
    int right = bst_node_height(node->right);
    if (left > right) {
        return left + 1;
    } else {
        return right + 1;
    }
}

// See .h for details
int bst_height(struct bst *t) {
    assert(t);

    return bst_node_height(t->root);
}