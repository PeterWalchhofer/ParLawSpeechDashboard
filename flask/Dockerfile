# Use an official Python runtime as the base image
FROM python:3.8-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the Python file to the working directory
COPY app.py /app/

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Install the required dependencies
RUN pip install flask flask_cors requests

# Set the entry point and command to run the Flask app
CMD ["flask", "--app", "app", "--debug", "run"]
