#include "least_letter.h"

int main(void) {
    int size = 0;
    int max_size = 1;
    char *str = malloc(sizeof(char));
    char read = '\0';
    while (scanf("%c", &read) == 1) {
        if (size >= max_size) {
            str = realloc(str, (max_size * 2) * sizeof(char));
            max_size *= 2;
        }
        str[size] = read;
        size++;
    }
    if (size >= max_size) {
        str = realloc(str, max_size *= 2);
        max_size *= 2;
    }
    str[size] = '\0';
    if (strcmp(str, "assert") == 0) {
        least_letter(NULL);
        return 0;
    }

    printf("The least common letter in \"%s\" is '%c'\n", str, least_letter(str));
    free(str);
}
