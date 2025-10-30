int main(void) {
    char str1[100];
    char str2[100];

    scanf("%99s %99s", str1, str2);
    if (strcmp(str1, "assert") == 0) {
        starts_with(NULL, NULL);
    } else if (starts_with(str1, str2)) {
        printf("true\n");
    } else {
        printf("false\n");
    }

    return 0;
}
