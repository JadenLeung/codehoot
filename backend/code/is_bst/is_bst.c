#include "is_bst.h"

bool is_node(struct btnode *node, int min, int max) {
    if (node == false) {
        return true;
    }

    if (node->item < min || node->item > max) {
        return false;
    }

    return is_node(node->left, min, node->item) &&
              is_node(node->right, node->item, max);
}

bool is_bst(struct bt *bt) {
    assert(bt);

    return is_node(bt->root, INT_MIN, INT_MAX);
}