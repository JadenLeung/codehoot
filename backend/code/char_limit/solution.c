#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

const int MAX_LEN = 80;

// char_limit(str): Returns true if str is <= the character limit MAX_LEN
// requires: str is a valid string
bool char_limit(const char *str) {
    assert(str);
    return strlen(str) <= MAX_LEN;
}