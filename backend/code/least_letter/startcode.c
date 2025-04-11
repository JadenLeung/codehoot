#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

// least_letter(str) will return the lower case version of the least common letter 
//   in a given string of letters. If two or more letters are tied, the one with 
//   the lowest ASCII value should be returned.
// requires: str is a valid string
//           str has at least one letter
//           str only contains letters (a-z + A-Z) [not asserted]
// time: O(n), O(nlogn) can get most points, O(n^2) will get some points
// examples: "HelloWorld" -> 'd'
//           "abc" -> 'a'
//           "AABbCc" -> 'a'
char least_letter(char *str) {
    // Your implementation here
    return '0';
}