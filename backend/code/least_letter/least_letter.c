#include "least_letter.h"

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
}