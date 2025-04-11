struct btnode {
    int item;
    struct btnode *left;
    struct btnode *right;
    int count;
  };
  
  struct bt {
    struct btnode *root;
  };
  
  // is_bst(bt) determines if the binary tree bt is a valid bst
  //   (i.e, all nodes in left are smaller and all nodes in right are larger)
  // requires: bt is valid
  // time: O(n)
  // examples:     1
  //             /   \        ->    true
  //            0     2
  //
  //               5
  //             /   \       ->     false
  //            4     3

// See .h for details
bool is_bst(struct bt *bt) {
    // Your implementation here
    return true || false;
}