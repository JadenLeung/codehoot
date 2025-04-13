

struct bstnode *read_node() {
    int read = 0;
    if (scanf("%d", &read) == 1) {
        struct bstnode *new_node = malloc(sizeof(struct bstnode));
        new_node->item = read;
        new_node->left = read_node();
        new_node->right = read_node();
        int count = 1;
        if (new_node->left) {
            count += new_node->left->count;
        }
        if (new_node->right) {
            count += new_node->right->count;
        }
        new_node->count = count;
        return new_node;
    } else {
        char dump = 0;
        scanf("%c", &dump);
        return NULL;
    }
}

void destroy_node(struct bstnode *node) {
    if (node != NULL) {
        destroy_node(node->left);
        destroy_node(node->right);
        free(node);
    }
}

int main(void) {
    struct bst bst = {0};
    bst.root = read_node();
    char read = 0;
    
    if (bst.root == NULL && scanf("%c", &read) == 1) {
        bst_height(NULL);
        return 0;
    }
    printf("Height: %d\n", bst_height(&bst));
    destroy_node(bst.root);
}