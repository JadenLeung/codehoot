import os

def run_code(code):
    f = open("main.c", "w")
    f.write(code)
    f.close()
    os.system('clang main.c && ./a.out > main.out')
