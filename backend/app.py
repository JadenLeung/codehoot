import os
import pwd
import stat
import subprocess
import signal
import glob
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import shutil

app = Flask(__name__)
CORS(app)

os.environ['ASAN_OPTIONS'] = 'detect_leaks=1:verbosity=2'

# Global variable to store subprocesses
subprocesses = []

def terminate_subprocesses(signal, frame):
    print("Server shutting down, terminating subprocesses.")
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
    temp_dir = tempfile.mkdtemp()
    try:
        main_c_path = os.path.join(temp_dir, "main.c")
        
        data = request.get_json()
        code = data.get('code')
        question = data.get('question')
        timeout = data.get('timeout')

        with open(f"code/headers.c", "r") as headers:
            with open(main_c_path, "w") as f:
                f.write(headers.read())

        with open(main_c_path, "a") as f:
            f.write(code)

        with open(f"code/{question}/main.c", "r") as harness_code:
            with open(main_c_path, "a") as f:
                f.write(harness_code.read())

        try:
            # Compile the code with AddressSanitizer enabled
            compile_process = subprocess.run(
                ['clang', '-fsanitize=address', '-fsanitize=leak', '-std=c99', '-g', '-Wall', '-Werror', 'main.c'],
                cwd=temp_dir,
                capture_output=True, text=True
            )

            if compile_process.returncode != 0 or len(compile_process.stderr) > 0:
                return jsonify({"error": "Compilation failed", "details": compile_process.stderr}), 500
            
            a_out_path = os.path.join(temp_dir, "a.out")
            
            # Set permissions for the `nobody` user
            set_permissions(a_out_path, "nobody")
            
            files = glob.glob(f"./code/{question}/tests/*.in")
            files.sort()

            files.remove(f"./code/{question}/tests/public.in")
            files.insert(0, f"./code/{question}/tests/public.in")

            correct = set([])
            incorrect = set([])
            for i, file in enumerate(files):
                with open(file, "r") as input_file:
                    input_text = input_file.read()
                    input_file.seek(0)  # Rewind the file for the subprocess

                    run_process = subprocess.Popen(
                        ['./a.out'],
                        cwd=temp_dir,
                        stdin=input_file,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        preexec_fn=demote('nobody')  # Run as a low-privilege user
                    )
                    subprocesses.append(run_process)  # Add process to the list
                    # Debug: Print file and directory permissions
                    print("File Permissions:", oct(os.stat(a_out_path).st_mode))
                    print("File Owner UID:", os.stat(a_out_path).st_uid)
                    print("File Owner GID:", os.stat(a_out_path).st_gid)
                    print("Directory Permissions:", oct(os.stat(temp_dir).st_mode))


                try:
                    stdout, stderr = run_process.communicate(timeout=timeout)
                except subprocess.TimeoutExpired:
                    if i == 0:
                        return jsonify({"output": f"Timeout: {timeout} second limit reached"})
                    incorrect.add(i)
                    run_process.kill()
                    continue

                # Check if the test is an assertion test
                if "assert" in file:
                    if run_process.returncode == 0 or code.count("assert") - 1 == 0:
                        incorrect.add(i)
                    else:
                        correct.add(i)
                    continue

                err = parse_asan(stderr)

                if run_process.returncode != 0:
                    return jsonify({"error": "Execution failed", "details": err}), 500
                    incorrect.add(i)

                basename, extension = os.path.splitext(file)
                res = stdout
                with open(basename + ".expect", "r") as expected:
                    expected = expected.read()
                    if (res != expected):
                        if i == 0:
                            return jsonify({"output": f"Failed public test case:\n{input_text} \nExpected:\n{expected}\nYour Output:\n{res}"})
                        incorrect.add(i)
                    else:
                        correct.add(i)
                        
            return jsonify({"output": f"{len(correct)}/{len(correct) + len(incorrect)} cases passed", 
            "correct": len(correct), "incorrect": len(incorrect), "numTests": len(correct) + len(incorrect)})

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    finally:
        shutil.rmtree(temp_dir)

def set_permissions(file_path, user_name):
    try:
        # Get the `nobody` user and group
        nobody_user = pwd.getpwnam(user_name)
        nobody_uid = nobody_user.pw_uid
        nobody_gid = nobody_user.pw_gid

        # Change ownership of the file to `nobody`
        os.chown(file_path, nobody_uid, nobody_gid)

        # Set file permissions to only allow execution by the owner
        os.chmod(file_path, stat.S_IXUSR)

    except Exception as e:
        raise RuntimeError(f"Failed to set permissions for {file_path}: {e}")

def demote(user_name):
    def result():
        user = pwd.getpwnam(user_name)
        os.setgid(user.pw_gid)
        os.setuid(user.pw_uid)
    return result


def parse_asan(message):
    if "ERROR" in message:
        return message.split("ERROR", 1)[1]
    return message


if __name__ == '__main__':
    app.run(port=5004, debug=True)