#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

const char *types[4] = {"int", "char", "bool", "struct"};
const int TYPES_LEN = 4;

bool starts_with(const char *a, const char *b) {
    assert(a);
    assert(b);
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

// initialized(str): Returns false if str meets this criteria:
//  1) After any initial whitespace, it starts with one of the types given by the types array
//  2) Ends with ;
//  3) Does not contain = 
// examples: "     int a;" -> false
//           "     int a; " -> true
//           "int** a;" -> false
//           "int a = 5;" -> true
// requires: str is a valid string
bool initialized(const char *str) {
    assert(str);
    int len = strlen(str);

    // Checks for ;
    if (len == 0 || str[len - 1] != ';') {
        return true;
    }

    // Checks for =
    for (int i = 0; i < len; ++i) {
        if (str[i] == '=') {
            return true;
        }
    }

    // Gets rid of initial whitespace
    for (int i = 0; i < len; ++i) {
        if (str[0] == ' ') {
            str++;
        } else {
            break;
        }
    }
    
    // Detects if it starts with anything in types
    for (int i = 0; i < TYPES_LEN; ++i) {
        if (starts_with(str, types[i])) {
            return false;
        }
    }
    return true;
}