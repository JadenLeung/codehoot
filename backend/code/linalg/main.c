// print_matrix(m) prints out a matrix.
// effects: Produces output
void print_matrix(struct matrix m) {
    for (int i = 0; i < m.height; i++){
        printf("[ ");
        for (int j = 0; j < m.width; j++){
            printf("%2d ", m.values[(m.width * i) + j] );
        }
        printf("]\n");
    }
}

int main(void) {
    int height, width;
    int bigarr[10000];
    int bigarr2[10000];

    // Read first matrix
    scanf("%d %d", &height, &width);
    for (int i = 0; i < height * width; i++) {
        scanf("%d", &bigarr[i]);
    }

    if (height == -1) {
        if (matrix_mult(NULL, NULL, NULL)) {
            printf("HUH");
        } else {
            printf("Matrix multiplication not possible.\n");
        }
        return 0;
    }

    struct matrix m1 = {{0}, height, width};
    memcpy(m1.values, bigarr, sizeof(int) * height * width);

    // Read second matrix
    scanf("%d %d", &height, &width);
    for (int i = 0; i < height * width; i++) {
        scanf("%d", &bigarr2[i]);
    }

    struct matrix m2 = {{0}, height, width};
    memcpy(m2.values, bigarr2, sizeof(int) * height * width);

    struct matrix product = {{0}, 0, 0};

    if (matrix_mult(&m1, &m2, &product)) {
        print_matrix(product);
    } else {
        printf("Matrix multiplication not possible.\n");
    }
}