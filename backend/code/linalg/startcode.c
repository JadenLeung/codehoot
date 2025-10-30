#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

struct matrix{
    int values[100];
    int height;
    int width;
};

// matrix_mult(m1, m2, matrix_product) is a function that takes in 2 matrices 
// and if possible, will perform matrix multiplication on them. the values of  
// the multiplication will be stored in matrix_product's values, and the height
// and width of matrix product will be stored in matrix_product's fields 
// respectively. returns true if the matrix multiplication is successful.
//
// Requires:
//   all pointers are not null
// Effects:
//   May modify matrix_product

bool matrix_mult(const struct matrix *m1, const struct matrix *m2, 
        struct matrix *matrix_product) {
    // Here so that the code will compile.
    return false;
}