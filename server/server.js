const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from our Netlify frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

/**
 * API ENDPOINT: /api/ocr
 * Handles PDF file uploads and simulates OCR processing.
 */
app.post('/api/ocr', upload.single('file'), (req, res) => {
  try {
    const { fileName, ocrMethod, pythonOcrPackage, ocrLanguage, selectedPages } = req.body;

    console.log('Received OCR request:', { fileName, ocrMethod });

    // Simulate a 2.5 second processing time
    setTimeout(() => {
        let ocrResult = `--- SIMULATED BACKEND OCR RESULT ---\n`;
        ocrResult += `File: ${fileName}\n`;
        ocrResult += `Language: ${ocrLanguage}\n`;
        ocrResult += `Pages: ${selectedPages}\n\n`;

        if (ocrMethod === 'llm') {
            ocrResult += `Method: LLM-based OCR\n`;
            ocrResult += `--- [LLM Model Vision Analysis] ---\nThis text was processed by the backend server using a simulated LLM Vision model.\n\n`;
        } else {
            ocrResult += `Method: Python Package (${pythonOcrPackage})\n`;
            switch (pythonOcrPackage) {
                case 'tesseract':
                    ocrResult += `--- [Tesseract OCR Engine] ---\nSimulated Tesseract output from the backend, which may c0ntain small errors.\n\n`;
                    break;
                case 'easyocr':
                    ocrResult += `--- [EasyOCR Engine] ---\nSimulated EasyOCR output from the backend, known for good multi-language handling.\n\n`;
                    break;
                case 'paddleocr':
                    ocrResult += `--- [PaddleOCR Engine] ---\nSimulated PaddleOCR output from the backend, great for complex layouts.\n\n`;
                    break;
            }
        }
        ocrResult += `--- END OF SIMULATION ---`;
        
        res.json({ ocrText: ocrResult });

    }, 2500);

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

/**
 * API ENDPOINT: /api/agent
 * Receives text and agent parameters, then simulates AI agent execution.
 */
app.post('/api/agent', (req, res) => {
    const { agent, inputText } = req.body;
    
    console.log('Received agent execution request for:', agent.name);
    
    // Simulate a 1.5 second API call
    setTimeout(() => {
        const simulatedOutput = `[${agent.name} Result from Backend]\nBased on prompt: "${agent.prompt}"\nModel: ${agent.model}\n\nThis is a simulated output from the Render server. It demonstrates that the frontend successfully sent data to the backend for processing.`;
        res.json({ output: simulatedOutput });
    }, 1500);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
