const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// --- NEW: Import PythonShell ---
const { PythonShell } = require('python-shell');

// --- OpenAI client remains the same ---
const OpenAI = require('@openai/api');
const openai = new OpenAI();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

/**
 * API ENDPOINT: /api/ocr (NOW USES PYTHON)
 * Saves the PDF temporarily, runs a Python script for OCR, and returns the result.
 */
app.post('/api/ocr', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}_${req.body.fileName}`);
    
    try {
        // Write the uploaded file buffer to the temporary file
        fs.writeFileSync(tempFilePath, req.file.buffer);
        console.log(`File saved temporarily to ${tempFilePath}`);

        const { ocrLanguage } = req.body;
        
        const options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './ocr_scripts/', // Path to the python script
            args: [tempFilePath, ocrLanguage] // Pass file path and language as arguments
        };

        // Run the Python script
        const results = await PythonShell.run('process_pdf.py', options);
        const ocrText = results.join('\n');
        
        console.log("OCR processing finished successfully.");
        res.json({ ocrText });

    } catch (error) {
        console.error('Python OCR Script Error:', error);
        res.status(500).json({ error: 'Failed to process file with Python OCR.', details: error.message });
    } finally {
        // --- IMPORTANT: Clean up the temporary file ---
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
            console.log(`Cleaned up temporary file: ${tempFilePath}`);
        }
    }
});

/**
 * API ENDPOINT: /api/agent (No changes needed here)
 * Uses the OpenAI API to execute an agent's prompt.
 */
app.post('/api/agent', async (req, res) => {
    // This function remains exactly the same
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
