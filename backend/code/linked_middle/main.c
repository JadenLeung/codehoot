
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

