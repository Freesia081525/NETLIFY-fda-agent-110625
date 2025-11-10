# Stage 1: Base image with Node.js, Python, and Tesseract
FROM node:18-slim

# Set working directory
WORKDIR /opt/render/project/src

# Install system dependencies needed for Python OCR
# - python3 and pip for running our script
# - poppler-utils for the pdf2image library
# - tesseract-ocr and its Chinese language pack
RUN apt-get update && apt-get install -y poppler-utils \
    python3 \
    python3-pip \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-chi-tra \
    && rm -rf /var/lib/apt/lists/*
# Copy Python requirements and install them
COPY ocr_scripts/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
# We copy package files first to leverage Docker layer caching
COPY package.json ./
COPY server/package.json ./server/
RUN npm install
COPY . .

# Set the start command for the server
CMD ["node", "server/server.js"]
