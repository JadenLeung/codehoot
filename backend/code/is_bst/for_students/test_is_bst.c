#include "is_bst.h"

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