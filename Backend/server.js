const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');
const User = require('./models/User');
const Conversation = require('./models/Conversation');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-development-secret';

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend/chatbot/dist')));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let dailyGreetingCache = { date: '', lines: [] };

const fallbackGreetings = [
  'A clearer day starts with one good question.',
  'Take your next idea a little further.',
];

function getUtcDate() {
  return new Date().toISOString().slice(0, 10);
}

function createToken(user) {
  return jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).id;
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: 'Name, email, and an 8-character password are required.' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ error: 'An account with that email already exists.' });
    const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Unable to create your account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ error: 'Email or password is incorrect.' });
    return res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Unable to sign in right now.' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  const user = await User.findById(req.userId).select('name email');
  if (!user) return res.status(401).json({ error: 'User not found.' });
  return res.json({ user });
});

app.get('/api/history', authRequired, async (req, res) => {
  const conversation = await Conversation.findOne({ user: req.userId }).sort({ updatedAt: -1 });
  return res.json({ messages: conversation?.messages || [] });
});

app.get('/api/greetings', async (req, res) => {
  const today = getUtcDate();
  if (dailyGreetingCache.date === today && dailyGreetingCache.lines.length === 2) {
    return res.json({ lines: dailyGreetingCache.lines });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Write exactly two short, warm greeting lines for an AI assistant landing page. Return only valid JSON in this shape: {"lines":["line one","line two"]}. No markdown, emojis, quotes around the whole response, or extra text.',
    });
    const parsed = JSON.parse(response.text.replace(/```json|```/g, '').trim());
    const lines = Array.isArray(parsed.lines)
      ? parsed.lines.map((line) => String(line).trim()).filter(Boolean).slice(0, 2)
      : [];
    dailyGreetingCache = { date: today, lines: lines.length === 2 ? lines : fallbackGreetings };
  } catch (error) {
    console.error('Greeting error:', error.message);
    dailyGreetingCache = { date: today, lines: fallbackGreetings };
  }

  return res.json({ lines: dailyGreetingCache.lines });
});

app.post('/api/chat', authRequired, async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) return res.status(400).json({ error: 'Message cannot be empty.' });
    const response = await ai.models.generateContent({ model: 'gemini-3.6-flash', contents: userMessage });
    const assistantMessage = response.text;
    let conversation = await Conversation.findOne({ user: req.userId }).sort({ updatedAt: -1 });
    if (!conversation) conversation = new Conversation({ user: req.userId, title: userMessage.slice(0, 48) });
    conversation.messages.push({ text: userMessage, sender: 'user' }, { text: assistantMessage, sender: 'bot' });
    await conversation.save();
    return res.json({ choices: [{ message: { role: 'assistant', content: assistantMessage } }] });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Something went wrong while generating a response.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../Frontend/chatbot/dist/index.html')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ali-ai')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  });
