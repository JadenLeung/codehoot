int main(void) {
    // Testing harness you don't have to worry about
    char str[1000];
    int line = 1;
    while (fgets(str, sizeof(str), stdin) != NULL) {
        int len = strlen(str);
        if (len > 0 && str[len - 1] == '\n') {
            str[len - 1] = '\0'; // Remove newline
        }
        if (strcmp(str, "assert") == 0) {
            char_limit(NULL);
        } else if (!char_limit(str)) {
            printf("Exceeded character limit on line %d\n", line);
        }
        ++line;
    }
    printf("End of input.\n");
    return 0;
}
