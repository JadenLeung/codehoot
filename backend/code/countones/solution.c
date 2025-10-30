#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>

// Given an integer n, ones will count the number of digit 1 appearing in n
// Requires: n is non-negative
// Examples: ones(10)   => 1
//           ones(99)   => 0
//           ones(111)  => 3
int ones(int n) {
    assert(n >= 0); 
    if (n == 0) {
        return 0;
    }
    if (n % 10 == 1) {
        return 1 + ones(n / 10);
    }
    return ones(n / 10); 
}

// Given an integer n, count the total number of digit 1 appearing 
//     in all non-negative integers less than or equal to n.
// Requires: n is non-negative 
// Examples:    count_ones(4) => 1
//              count_ones(12) = 6
int count_ones(int n) {
    assert(n >= 0); 
    if (n == 0) {
        return 0; 
    }

    // For this implementation we count the number of ones in n
    // then add that to the number of ones in n - 1
    // recurse until we reach 0 
    return ones(n) + count_ones(n - 1); 

    // This is slow since for large n we have to compute every value from 
    // 1 -> n and add them together
    // This solution will be dependent on the size of n
    // For a faster solution we will try to find a way to compute the number 
    //      of ones that only relies on the size of log(n)
}
