# Use Ubuntu as the base image
FROM ubuntu:22.04

# Set working directory
WORKDIR /python-docker

# Install necessary utilities including bash, python3, pip, and clang
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    python3 \
    python3-pip \
    clang \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose the Flask app port
EXPOSE 5004

# Run the Flask app
CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=5004" ]
