#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>


char to_lower_case(char c) {
    if (c >= 'A' && c <= 'Z') {
        return (c - 'A') + 'a';
    }
    return c;
}

char least_letter(char *str) {
    assert(str);
    assert(str[0]);

    const int num_letters = 26;
    int counts[26] = {0};
    while (*str) {
        counts[to_lower_case(*str) - 'a'] += 1;
        str++;
    }

    int min = INT_MAX;
    int max_index = 0;
    for (int i = 0; i < num_letters; i++) {
        if (counts[i] < min && counts[i] > 0) {
            
            min = counts[i];
            max_index = i;
        }
    }

    return 'a' + max_index;
}int main(void) {
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
