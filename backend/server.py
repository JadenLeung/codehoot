import subprocess
import signal
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def terminate_subprocesses(signal, frame):
    print("Server shutting down, terminating subprocesses.")
    # Optionally, add logic to kill subprocesses here
    os._exit(0)  # Forcefully stop the server

signal.signal(signal.SIGINT, terminate_subprocesses)

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    data = data.get('code')

    with open("main.c", "w") as f:
        f.write(data)

    try:
        compile_process = subprocess.run(
            ['clang', '-std=c99', '-g', '-Wall', 'main.c'],
            capture_output=True, text=True
        )

        if compile_process.returncode != 0:
            return jsonify({"error": "Compilation failed", "details": compile_process.stderr}), 500

        run_process = subprocess.run(
            ['./a.out'],
            capture_output=True, text=True
        )

        if run_process.returncode != 0:
            return jsonify({"error": "Execution failed", "details": run_process.stderr}), 500

        return jsonify({"output": run_process.stdout})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
