# Base image with Node.js 18 (includes npm) and Debian slim
FROM node:18-slim

# Set working directory
WORKDIR /opt/render/project/server

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-chi-tra \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ocr_scripts/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package.json ./
COPY server/package.json ./server/
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Start the server
CMD ["node", "server/server.js"]
