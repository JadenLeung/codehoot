#include "print_waves.h"

void print_spaces(int n) {
    for (int i = 0; i < n; i++) {
        printf(" ");
    }
}

// See .h for details
void print_waves(int height, int count) {
    assert(height >= 2);
    assert(count > 0);

    const int underscore_length = 3;

    for (int h = 0; h < height; h++) {
        for (int c = 0; c < count; c++) {
            if (h == 0) {
                print_spaces(height - 1);
                printf("___");
                if (c < count - 1) {
                    print_spaces(height - 1);
                    print_spaces(underscore_length);
                }
            } else if (h == height - 1) {
                printf("/");
                print_spaces(height - 2);
                print_spaces(underscore_length);
                print_spaces(height - 2);
                printf("\\");
                printf("___");
            } else {
                print_spaces(height - 1 - h);
                printf("/");
                print_spaces((h - 1) * 2 + underscore_length);
                printf("\\");
                if (c < count - 1) {
                    print_spaces(height - 1 - h + underscore_length);
                }
            }
        }
        printf("\n");
    }
}