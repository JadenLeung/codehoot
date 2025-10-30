int call_count = 0;

bool generic_binary_search(const void *key, const void *arr, int len,
                           size_t size,
                           int (*compare)(const void *, const void *));

int int_comp(const void *a, const void *b) {
  assert(a);
  assert(b);
  ++call_count;
  return *(const int *)a - *(const int *)b;
}

int char_comp(const void *a, const void *b) {
  assert(a);
  assert(b);
  ++call_count;
  return *(const char *)a - *(const char *)b;
}

int main(void) {
  char type = '\0';
  int len = 0;
  int int_arr[1024] = {0};
  int int_key = '\0';
  char char_arr[1024] = {0};
  char char_key = '\0';
  int (*comp)(const void *, const void *) = NULL;
  const void *arr;
  const void *key;
  size_t size = 0;

  if (scanf("%c", &type) != 1) {
    printf("error reading input type\n");
    return 1;
  }

  if (scanf("%d", &len) != 1) {
    printf("error reading length\n");
    return 1;
  }

  switch (type) {
    case 'i': {
      for (int i = 0; i < len; ++i) {
        scanf("%d", int_arr + i);
      }
      arr = (const void *)int_arr;
      comp = int_comp;
      size = sizeof(int);
      scanf("%d", &int_key);
      key = &int_key;
    } break;
    case 'c': {
      for (int i = 0; i < len; ++i) {
        scanf(" %c", char_arr + i);
      }
      arr = (const void *)char_arr;
      comp = char_comp;
      size = sizeof(char);
      scanf(" %c", &char_key);
      key = &char_key;
    } break;
    default:
      break;
  }
  bool found = generic_binary_search(key, arr, len, size, comp);
  if (call_count < 10) {
    if (found) {
      printf("found\n");
    } else {
      printf("not found\n");
    }
  } else {
    printf("Runtime too slow!\n");
  }
  return 0;
}