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
            space_check(NULL);
        } else if (!space_check(str)) {
            printf("Missing whitespace on line %d\n", line);
        }
        ++line;
    }
    return 0;
}
