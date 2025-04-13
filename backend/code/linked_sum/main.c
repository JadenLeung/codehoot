

void free_nodes(struct llnode *node) {
    if (node != NULL) {
        free_nodes(node->next);
        free(node);
    }
}

int main(void) {
    int read = 0;
    struct llist ll = {0};
    while (scanf("%d", &read) == 1) {
        struct llnode *node = malloc(sizeof(struct llnode));
        node->item = read;
        node->next = ll.front;
        ll.front = node;
    }
    char test = 0;
    if (scanf("%c", &test) == 1) {
        linked_sum(NULL);
        free_nodes(ll.front);
        return 0;
    }

    printf("Sum: %d\n", linked_sum(&ll));
    free_nodes(ll.front);
}