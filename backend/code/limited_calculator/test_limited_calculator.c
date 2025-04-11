#include "limited_calculator.h"

int main(void) {
    char read_c = 0;
    int read_i = 0;
    scanf("%d", &read_i);
    struct calculator *c = create_calculator(read_i);
    while (scanf(" %c", &read_c) == 1) {
        scanf("%d", &read_i);
        if (read_c == 'a') {
            add(read_i, c);
        } else if (read_c == 's') {
            subtract(read_i, c);
        } else if (read_c == 'x') {
            destroy_calculator(NULL);
            return 0;
        } else {
            add(1, NULL);
            return 0;
        }
        printf("New answer: %d\n", get_answer(c));
    }
    destroy_calculator(c);
}