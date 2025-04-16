#include <stdlib.h>
#include <stdio.h>
#include <limits.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

struct bstnode {
    int item;
    struct bstnode *left;
    struct bstnode *right;
    int count;
};
  
struct bst {
    struct bstnode *root;
};

// bst_height(t) finds the height of bst t. A bst with 0 nodes should have
//   a height of 0. A bst with 1 node should have a height of 1
// requires: t is a valid bst
// time: O(n)
// examples: t:    5                            
//               /  \        ->    3           
//              3    6                        
//             /                              
//            4
int bst_height(struct bst *t) {
    return 4;
}
