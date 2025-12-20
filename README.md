# ✨ Ali's AI Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)
![AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4.svg?logo=google)

A modern, beautiful AI-powered chatbot built with React and Google Gemini AI.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

- 🤖 **AI-Powered Conversations** - Powered by Google Gemini 2.5 Flash model
- 🎨 **Modern Dark Theme UI** - Beautiful glassmorphism design with animated gradients
- ✨ **Smooth Animations** - Liquid blob backgrounds, message slide-ins, typing indicators
- 📝 **Markdown Support** - Renders formatted responses with headers, lists, code blocks, tables
- 💬 **Real-time Chat** - Instant messaging with loading states
- 📱 **Fully Responsive** - Works beautifully on desktop and mobile
- 🚀 **Quick Suggestions** - Pre-built prompts for easy start
- 🎯 **Auto-scroll** - Automatically scrolls to latest messages

---

## 📸 Demo

### Chat Interface
The chatbot features a stunning dark theme with animated gradient blobs, glassmorphism effects, and smooth transitions.

### Key UI Elements
- **Header** with status indicator and gradient text
- **Chat Window** with user/bot avatars and styled message bubbles
- **Input Area** with animated send button
- **Typing Indicator** with bouncing dots
- **Suggestion Buttons** for quick prompts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| react-markdown | 10.1.0 | Markdown Rendering |
| CSS3 | - | Styling & Animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime |
| Express | 4.18.2 | Web Server |
| @google/genai | 1.34.0 | Gemini AI SDK |
| cors | 2.8.5 | Cross-Origin Requests |
| dotenv | 16.3.1 | Environment Variables |

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/chatbot.git
cd chatbot
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd ../Frontend/chatbot

# Install dependencies
npm install
```

---

## 🚀 Usage

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd Backend
npm start
# or with nodemon for auto-reload
nodemon server.js
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd Frontend/chatbot
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
cd Frontend/chatbot
npm run build
```

**Start Server (serves both API and built frontend):**
```bash
cd Backend
npm start
```
Access at `http://localhost:3000`

---

## 📁 Project Structure

```
chatbot/
├── 📂 Backend/
│   ├── 📄 server.js          # Express server & API routes
│   ├── 📄 package.json       # Backend dependencies
│   ├── 📄 .env               # Environment variables (not in git)
│   └── 📂 public/            # Static files
│
├── 📂 Frontend/
│   └── 📂 chatbot/
│       ├── 📂 src/
│       │   ├── 📄 App.jsx    # Main React component
│       │   ├── 📄 App.css    # Styles & animations
│       │   ├── 📄 main.jsx   # React entry point
│       │   └── 📂 assets/    # Static assets
│       ├── 📄 index.html     # HTML template
│       ├── 📄 vite.config.js # Vite configuration
│       └── 📄 package.json   # Frontend dependencies
│
├── 📄 .gitignore             # Git ignore rules
└── 📄 README.md              # This file
```

---

## 🔌 API Reference

### POST `/api/chat`

Send a message to the AI and receive a response.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing great, thank you for asking! How can I help you today?"
      }
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Something went wrong"
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
```

### Vite Proxy Configuration

The frontend proxies API requests to the backend. Configuration in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

---

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `App.css`:

```css
/* Primary gradient colors */
background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);

/* Background color */
background: #0f0f1a;

/* Accent color */
color: #a78bfa;
```

### Changing the AI Model

Edit `server.js`:
```javascript
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",  // Change model here
    contents: userMessage
});
```

### Adding New Suggestions

Edit the suggestions array in `App.jsx`:
```jsx
<div className="suggestions">
  <button className="suggestion" onClick={() => handleSuggestionClick("Your prompt here")}>
    🎯 Your Label
  </button>
  {/* Add more suggestions */}
</div>
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `CORS error` | Ensure backend is running and CORS is configured |
| `API key invalid` | Check your `.env` file has correct Gemini API key |
| `Cannot connect to server` | Verify backend is running on port 3000 |
| `Module not found` | Run `npm install` in both Backend and Frontend |
| `Port already in use` | Kill the process or change PORT in `.env` |

### Debug Mode

Check browser console and terminal for error messages.

---

## 📝 Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `nodemon server.js` | Start with auto-reload |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ali**

- GitHub: [Ali1180-uni](https://github.com/Ali1180-uni)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for the powerful AI model
- [React](https://react.dev/) for the amazing UI framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

<div align="center">

Made with ❤️ by Ali

⭐ Star this repo if you found it helpful!

</div>
