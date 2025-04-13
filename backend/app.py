import subprocess
import signal
import os
import glob
import shutil
import tempfile
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

@app.route('/solution')
def get_public():
    question = request.args.get('question')

@app.route('/code')
def get_code():
    question = request.args.get('question')
    with open(f"code/{question}/startcode.c", "r") as f:
        with open(f"code/{question}/tests/public.in", "r") as infile:
            with open(f"code/{question}/tests/public.expect", "r") as expectfile:
                with open(f"code/{question}/solution.c", "r") as solution:
                    return jsonify({"code": f.read(), "in": infile.read(), "expect": expectfile.read(), "solution": solution.read()})

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    code = data.get('code')
    question = data.get('question')

    # List of forbidden keywords or patterns in C code
    forbidden_keywords = [
        "system(", "fork(", "exec", "popen(", "socket(", "kill(",
        "#include <unistd", "#include <sys", "#include <signal", "#include <fcntl",
        "open(", "creat(", "unlink(", "rename(",
        "fopen(", "freopen(", "fclose(", "fread(", "fwrite("
    ]

    # Check for any forbidden keywords
    for keyword in forbidden_keywords:
        if keyword in code:
            return jsonify({
                "error": "Forbidden code detected",
                "details": f"Use of dangerous function or header: '{keyword}'"
            }), 400

    # Create a temporary directory
    with tempfile.TemporaryDirectory() as tmpdir:

        with open(os.path.join(tmpdir, "main.c"), "w") as f:
            with open(f"code/headers.c", "r") as headers:
                f.write(headers.read())
            f.write(code)
            with open(f"code/{question}/main.c", "r") as harness_code:
                f.write(harness_code.read())

        try:
            # Compile the code with AddressSanitizer enabled
            compile_process = subprocess.run(
                ['clang', '-fsanitize=address', '-fsanitize=leak', '-std=c99', '-g', '-Wall', '-Werror', os.path.join(tmpdir, "main.c")],
                cwd=tmpdir,
                capture_output=True, text=True
            )

            if compile_process.returncode != 0 or len(compile_process.stderr) > 0:
                return jsonify({"error": "Compilation failed", "details": compile_process.stderr}), 500
            
            files = glob.glob(f"./code/{question}/tests/*.in")
            files.sort()

            files.remove(f"./code/{question}/tests/public.in")
            files.insert(0, f"./code/{question}/tests/public.in")

            correct = set([])
            incorrect = set([])
            for i, file in enumerate(files):
                with open(file, "r") as input_file:
                    input_text = input_file.read()

                # Execute the binary
                try:
                    run_process = subprocess.Popen(
                        ['./a.out'],
                        stdin=subprocess.PIPE,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        cwd=tmpdir,  # Ensure the process runs in the tmpdir
                        text=True
                    )
                    subprocesses.append(run_process)  # Add process to the list

                    stdout, stderr = run_process.communicate(input=input_text, timeout=2)

                except subprocess.TimeoutExpired:
                    if  i == 0:
                        return jsonify({"output": f"Timeout: 2 second limit reached"})
                    incorrect.add(i)
                    run_process.kill()
                    continue

                # Check if the test is an assertion test
                if "assert" in file:
                    print(f"Assertion: return code for {file}: {run_process.returncode}", code.count("assert") , code.count("assert.h") )
                    if run_process.returncode == 0 or code.count("assert") - code.count("assert.h") == 0:
                        incorrect.add(i)
                    else:
                        correct.add(i)
                    continue

                err = parse_asan(stderr)

                if run_process.returncode != 0:
                    return jsonify({"error": "Execution failed", "details": err}), 500

                basename, extension = os.path.splitext(file)
                res = stdout
                with open(basename + ".expect", "r") as expected:
                    expected = expected.read()
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
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)