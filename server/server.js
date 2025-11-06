const express = require('express');
const cors = require('cors');
const multer = require('multer');

// --- NEW: Import and configure AI clients ---
const OpenAI = require('@openai/api');
const vision = require('@google-cloud/vision');

// Initialize OpenAI client
// The API key is automatically read from the OPENAI_API_KEY environment variable
const openai = new OpenAI();

// Initialize Google Cloud Vision client
// The credentials are automatically read from the GOOGLE_APPLICATION_CREDENTIALS environment variable
// which Render sets for us when we create the secret file.
const visionClient = new vision.ImageAnnotatorClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB file limit

/**
 * API ENDPOINT: /api/ocr (NOW REAL)
 * Uses Google Cloud Vision to perform OCR on an uploaded PDF.
 */
app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log(`Received OCR request for file: ${req.body.fileName}`);

    const fileBuffer = req.file.buffer;

    const request = {
      inputConfig: {
        mimeType: 'application/pdf',
        content: fileBuffer,
      },
      features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
    };

    // Perform the OCR using Google Cloud Vision API
    const [result] = await visionClient.batchAnnotateFiles({ requests: [request] });
    const fullTextAnnotation = result.responses[0].responses[0].fullTextAnnotation;

    if (!fullTextAnnotation || !fullTextAnnotation.text) {
        return res.status(500).json({ ocrText: "OCR successful, but no text was found in the document."});
    }

    res.json({ ocrText: fullTextAnnotation.text });

  } catch (error) {
    console.error('Google Vision OCR Error:', error);
    res.status(500).json({ error: 'Failed to process file with Google Cloud Vision.', details: error.message });
  }
});

/**
 * API ENDPOINT: /api/agent (NOW REAL)
 * Uses the OpenAI API to execute an agent's prompt.
 */
app.post('/api/agent', async (req, res) => {
    const { agent, inputText } = req.body;
    console.log(`Received agent execution request for: ${agent.name}`);
    
    try {
        const completion = await openai.chat.completions.create({
            model: agent.model, // e.g., "gpt-4o-mini"
            temperature: agent.temperature,
            messages: [
                { role: "system", content: "You are a helpful assistant designed to analyze documents." },
                { role: "user", content: `${agent.prompt}\n\nHere is the document text:\n\n---\n\n${inputText}` }
            ]
        });

        const output = completion.choices[0].message.content;
        res.json({ output });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Failed to execute agent with OpenAI API.', details: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
