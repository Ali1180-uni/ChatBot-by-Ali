const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// CORS configuration for development
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"]
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../Frontend/chatbot/dist')));

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Generate content using Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage
        });

        const assistantMessage = response.text;
        
        // Debug: log the response
        console.log("Gemini Response:", assistantMessage);

        // Send formatted response to frontend
        res.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: assistantMessage
                    }
                }
            ]
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Serve React app for all other routes (client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/chatbot/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
