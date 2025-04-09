import subprocess
import signal
import os
import glob
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

os.environ['ASAN_OPTIONS'] = 'detect_leaks=1:verbosity=2'

# Global variable to store subprocesses
subprocesses = []

def terminate_subprocesses(signal, frame):
    print("Server shutting down, terminating subprocesses.")
    # Terminate all active subprocesses
    for p in subprocesses:
        p.terminate()  # Gracefully terminate the subprocess
        p.wait()  # Wait for the subprocess to fully exit
    os._exit(0)  # Forcefully stop the server after subprocesses are terminated

# Register SIGINT (Ctrl+C) handler
signal.signal(signal.SIGINT, terminate_subprocesses)

@app.route('/')
def hello_world():
    return 'Hello World'


@app.route('/code')
def get_code():
    question = request.args.get('question')
    with open(f"code/{question}/startcode.c", "r") as f:
        return f.read()

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    code = data.get('code')
    question = data.get('question')


    with open(f"code/headers.c", "r") as headers:
        with open("main.c", "w") as f:
            f.write(headers.read())

    
    with open("main.c", "a") as f:
        f.write(code)

    with open(f"code/{question}/main.c", "r") as harness_code:
        with open("main.c", "a") as f:
            f.write(harness_code.read())

    try:
        # Compile the code with AddressSanitizer enabled
        compile_process = subprocess.run(
            ['clang', '-fsanitize=address', '-fsanitize=leak', '-std=c99', '-g', '-Wall', '-Werror', 'main.c'],
            capture_output=True, text=True
        )

        if compile_process.returncode != 0 or len(compile_process.stderr) > 0:
            return jsonify({"error": "Compilation failed", "details": compile_process.stderr}), 500
        
        files = glob.glob(f"./code/{question}/tests/*.in")
        files.sort()
        print(files)
        

        correct = set([])
        incorrect = set([])
        for i, file in enumerate(files):
            print(file)
            with open(file, "r") as input_file:
                run_process = subprocess.Popen(
                    ['./a.out'],
                    stdin=input_file,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                subprocesses.append(run_process)  # Add process to the list


            with open(file, "r") as input_file:
                input_text = input_file.read()
            # Wait for the process to finish
            stdout, stderr = run_process.communicate()

            err = parse_asan(stderr)

            if run_process.returncode != 0:
                return jsonify({"error": "Execution failed", "details": err}), 500

            basename, extension = os.path.splitext(file)
            print(basename)
            res = stdout
            with open(basename + ".expect", "r") as expected:
                expected = expected.read()
                print(str(res == expected), expected)
                if (res != expected):
                    if  i == 0:
                        return jsonify({"output": f"Failed public test case:\n{input_text} \nExpected:\n{expected}\nYour Output:\n{res}"})
                    incorrect.add(i)
                else:
                    correct.add(i)
                    

        return jsonify({"output": f"{len(correct)}/{len(correct) + len(incorrect)} cases passed", 
        "correct": len(correct), "incorrect": len(incorrect), "numTests": len(correct) + len(incorrect)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def parse_asan(message):
    if "ERROR" in message:
        return message.split("ERROR", 1)[1]
    return message


if __name__ == '__main__':
    app.run(port=5004, debug=True)
