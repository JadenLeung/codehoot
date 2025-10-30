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

bool matrix_mult(const struct matrix * m1, const struct matrix * m2, struct matrix * matrix_product) {
    assert(m1);
    assert(m2);
    assert(matrix_product);

    // matrix multiplication condition
    if (m1->width != m2->height){
        return false;
    } 

    // MxN * NxO results in an MxO matrix 
    matrix_product->height = m1->height;
    matrix_product->width = m2->width;

    for (int i = 0; i < m2->width; i++){
        for (int j = 0; j < m1->height; j++){
            int sum = 0;
            for (int k = 0; k < m1->width; k++){
                sum += (m1->values[(j * m1->width) + k] 
                        * m2->values[((m2->width * k) + i)]);
            }
            matrix_product->values[(matrix_product->width * j) + i] = sum;
        }
    }

    return true;
}