#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

const char *badspaces[6] = {"if(", "for(", "while(", "){", "else{", "}else"};
const int BADSPACES_LEN = 6;

bool starts_with(const char *a, const char *b) {
    int len_a = strlen(a);
    int len_b = strlen(b);
    if (len_b > len_a) {
        return false;
    }
    for (int i = 0; i < len_b; ++i) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

// space_check(str): Returns false if there's an instance of any bad spacing errors denoted in badspaces
//   The space checker ignores any bad spaces after a single-line comment "//"
// requires: str is a valid string
bool space_check(const char *str) {
    assert(str);
    int len = strlen(str);
    for (int i = 0; i < len; ++i) {
        if (starts_with(str, "//")) {
            return true;
        }
        for (int j = 0; j < BADSPACES_LEN; ++j) {
            const char *badspace = badspaces[j];
            if (starts_with(str, badspace)) {
                return false;
            }
        }
        ++str;
    }
    return true;
}