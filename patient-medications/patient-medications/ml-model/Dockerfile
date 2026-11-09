FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if any
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source and pre-trained models
COPY . .

EXPOSE 5001

ENV PORT=5001
ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "--workers=2", "--bind=0.0.0.0:5001", "--timeout=120", "app:app"]

