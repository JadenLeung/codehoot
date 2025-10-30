# Use a minimal and lightweight base image
FROM python:3.11-slim

# Set working directory
WORKDIR /python-docker

# Add a non-root user for running the application
RUN useradd -m flaskuser && \
    mkdir -p /python-docker && \
    chown -R flaskuser:flaskuser /python-docker

# Install necessary utilities, gcc, and valgrind
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    python3-pip \
    gcc \
    valgrind \
    make \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

# Switch to non-root user
USER flaskuser

# Copy and install Python dependencies
COPY --chown=flaskuser:flaskuser requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code
COPY --chown=flaskuser:flaskuser code/ /python-docker/code/
COPY --chown=flaskuser:flaskuser app.py /python-docker/app.py

# Make code/ directory read-only
RUN chmod -R 0555 /python-docker/code
RUN chmod 0555 /python-docker/app.py

RUN chmod 1775 /python-docker

# Expose the default Cloud Run port (8080)
EXPOSE 8080

# Run the app
CMD ["bash", "-c", "ulimit -s 8192 && exec python3 app.py"]
