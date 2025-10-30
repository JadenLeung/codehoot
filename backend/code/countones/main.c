int main(void) {
    int val = -1;
    int retval = scanf("%d", &val);
    if (1 == retval){
        printf("%d\n", count_ones(val));
    }
}