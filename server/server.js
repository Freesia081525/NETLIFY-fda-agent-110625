const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { PythonShell } = require('python-shell');
const { OpenAI } = require('openai');

const openai = new OpenAI();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for potential base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB limit for PDFs

/**
 * API ENDPOINT: /api/ocr (NOW WITH LLM/PYTHON ROUTING)
 */
app.post('/api/ocr', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}_${req.body.fileName}`);
    const { ocrLanguage, ocrMethod } = req.body; // Get the user's choice

    try {
        fs.writeFileSync(tempFilePath, req.file.buffer);
        console.log(`File saved to ${tempFilePath}, chosen method: ${ocrMethod}`);

        let ocrText = "";

        if (ocrMethod === 'llm') {
            // --- LLM-based OCR (GPT-4o) ---
            console.log("Starting LLM-based OCR with GPT-4o...");
            
            // 1. Convert PDF to base64 images using our new Python script
            const imageOptions = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: './ocr_scripts/',
                args: [tempFilePath]
            };
            const results = await PythonShell.run('pdf_to_images.py', imageOptions);
            const base64Images = JSON.parse(results[0]);

            // 2. Prepare the request for OpenAI GPT-4o
            const messages = [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "You are an expert OCR engine. Extract all text from the following document pages exactly as it appears. Preserve the original line breaks and formatting as best as possible."
                        },
                        // Add each page as an image
                        ...base64Images.map(imageBase64 => ({
                            type: "image_url",
                            image_url: { "url": imageBase64 }
                        }))
                    ],
                },
            ];

            // 3. Call the OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages,
                max_tokens: 4000,
            });
            
            ocrText = response.choices[0].message.content;

        } else {
            // --- Python Package-based OCR (Default) ---
            console.log("Starting Python package-based OCR...");
            const pythonOptions = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: './ocr_scripts/',
                args: [tempFilePath, ocrLanguage]
            };
            const results = await PythonShell.run('process_pdf.py', pythonOptions);
            ocrText = results.join('\n');
        }
        
        console.log("OCR processing finished successfully.");
        res.json({ ocrText });

    } catch (error) {
        console.error('OCR Processing Error:', error);
        res.status(500).json({ error: 'Failed to process file on backend.', details: error.message || "Unknown error" });
    } finally {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
            console.log(`Cleaned up temp file: ${tempFilePath}`);
        }
    }
});

// The /api/agent endpoint remains unchanged.
app.post('/api/agent', async (req, res) => {
    // ... (paste the existing /api/agent function here)
    const { agent, inputText } = req.body;
    console.log(`Received agent execution request for: ${agent.name}`);
    try {
        const completion = await openai.chat.completions.create({
            model: agent.model,
            temperature: agent.temperature,
            messages: [
                { role: "system", content: "You are a helpful assistant designed to analyze documents." },
                { role: "user", content: `${agent.prompt}\n\nHere is the document text:\n\n---\n\n${inputText}` }
            ]
        });
        res.json({ output: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Failed to execute agent with OpenAI API.', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
