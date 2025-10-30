#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

const int MAX_LEN = 80;
const char *badspaces[6] = {"if(", "for(", "while(", "){", "else{", "}else"};
const int BADSPACES_LEN = 6;
const char *types[4] = {"int", "char", "bool", "struct"};
const int TYPES_LEN = 4;

// char_limit(str): Returns true if str is <= the character limit MAX_LEN
// requires: str is a valid string
bool char_limit(const char *str) {
    assert(str);
    return strlen(str) <= MAX_LEN;
}