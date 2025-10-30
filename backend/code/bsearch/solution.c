#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

bool generic_binary_search(const void *key, const void *arr, int len,
                           size_t size,
                           int (*compare)(const void *, const void *)) {
  assert(key);
  assert(arr);
  assert(len > 0);
  assert(size > 0);
  assert(compare);

  int l = 0;
  int r = len;

  while (l < r) {
    int mid = (l + r) / 2;
    int res = compare(key, arr + size * mid);
    if (res == 0) {
      return true;
    }
    if (res < 0) {
      r = mid;
    } else {
      l = mid + 1;
    }
  }

  return false;
}