import subprocess
import signal
import os
import glob
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

os.environ['ASAN_OPTIONS'] = 'detect_leaks=1:verbosity=2'

def terminate_subprocesses(signal, frame):
    print("Server shutting down, terminating subprocesses.")
    # Optionally, add logic to kill subprocesses here
    os._exit(0)  # Forcefully stop the server

signal.signal(signal.SIGINT, terminate_subprocesses)

@app.route('/')
def hello_world():
    return 'Hello World'


@app.route('/code')
def get_code():
    question = request.args.get('question')
    f = open(f"code/{question}/startcode.c", "r")
    return f.read()

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    code = data.get('code')
    question = data.get('question')

    with open("main.c", "w") as f:
        f.write(code)


    with open(f"code/{question}/main.c", "r") as harness_code:
        with open("main.c", "a") as f:
            f.write(harness_code.read())

    try:
        compile_process = subprocess.run(
            ['clang', '-fsanitize=address', '-fsanitize=leak', '-std=c99', '-g', '-Wall', 'main.c'],
            capture_output=True, text=True
        )

        if compile_process.returncode != 0:
            return jsonify({"error": "Compilation failed", "details": compile_process.stderr}), 500

        
        files = glob.glob(f"./code/{question}/tests/*.in")
        files.sort()
        print(files)
        
        for file in files:
            print(file)
            with open(file, "r") as input_file:
                run_process = subprocess.run(
                    ['./a.out'],
                    stdin=input_file,
                    capture_output=True,
                    text=True
                )


            err = parse_asan(run_process.stderr)

            if run_process.returncode != 0:
                return jsonify({"error": "Execution failed", "details": err}), 500

            basename, extension = os.path.splitext(file)
            print(basename)
            res = run_process.stdout
            with open(basename + ".expect", "r") as expected:
                print(str(res == expected.read()), expected.read())
                if (res != expected.read()):
                    print("not equal")
            
            return jsonify({"output": str(res == "7\n")})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



def parse_asan(message):
    if "ERROR" in message:
        return message.split("ERROR", 1)[1]
    return message


if __name__ == '__main__':
    app.run(port=5001, debug=True)
