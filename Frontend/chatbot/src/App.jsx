import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || isLoading) return;

    // Display user message
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const assistantMessage = data.choices[0].message.content;
        setMessages((prev) => [...prev, { text: assistantMessage, sender: "bot" }]);
      } else {
        console.error("No choices in response:", data);
        setMessages((prev) => [...prev, { text: "Oops! Something went wrong. Try again.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Unable to connect. Please check your connection.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <h1>✨ Ali's Assistant</h1>
        <div className="subtitle">
          <span className="status-dot"></span>
          Powered by AI • Created by M.Ali Tahir 
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="mainWindow">
        <div className="chatWindow" ref={chatWindowRef}>
          {messages.length === 0 ? (
            <div className="emptyState">
              <div className="icon">💬</div>
              <p>How can I help you today?</p>
              <div className="suggestions">
                <button className="suggestion" onClick={() => handleSuggestionClick("Help me in Maths")}>😄 Help me in Maths</button>
                <button className="suggestion" onClick={() => handleSuggestionClick("What can you do?")}>🤔 What can you do?</button>
                <button className="suggestion" onClick={() => handleSuggestionClick("Create a Website")}>✍️ Create a Website</button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="avatar">
                  {msg.sender === "user" ? "👤" : "🤖"}
                </div>
                <div className="content">
                  <span className="sender">{msg.sender === "user" ? "You" : "Assistant"}</span>
                  <div className="bubble">
                    {msg.sender === "bot" ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="typing-indicator">
              <div className="avatar">🤖</div>
              <div className="dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="inputArea">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            <span className="icon">🚀</span>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
