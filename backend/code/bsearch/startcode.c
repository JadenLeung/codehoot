#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// generic_binary_search(key, arr, len, size, compare)
// returns true if key is found in arr, and false otherwise
// requires:
//        len > 0
//        size > 0
//        compare is strcmp style comparison function [not asserted]
//        arr is sorted according to compare [not asserted]
// runtime: O(log(n)) where n == len (We will be checking the runtime, linear search is not allowed!)
bool generic_binary_search(const void *key, const void *arr, int len,
                           size_t size,
                           int (*compare)(const void *, const void *)) {
  assert(key);
  assert(arr);
  assert(len > 0);
  assert(size > 0);
  assert(compare);

  // your implementation goes here

  return false;
}