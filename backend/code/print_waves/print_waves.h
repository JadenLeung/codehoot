#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

// print_waves(height, count) prints count waves with the given height
//   Each wave should have 3 '_' at the top and bottom. The slopes of the
//   waves are made using '/' and '\'. There should be no extra spaces at
//   the end of the final wave. See examples for more details
// requires: height is atleast 2 
//           count is positive
// effects: produces output
// time: O(height * count)
// examples: height 2, count 1:   ___
//                               /   \___
//           height 3, count 2:    ___       ___
//                                /   \     /   \
//                               /     \___/     \___
//           height 4, count 1:     ___
//                                 /   \
//                                /     \
//                               /       \___
void print_waves(int height, int count);