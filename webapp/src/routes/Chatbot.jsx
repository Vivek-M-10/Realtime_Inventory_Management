// ChatBot.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); // 👈 detect role here

      // 🔹 Choose API based on role
      const apiUrl =
        role === "Admin"
          ? "http://localhost:8003/chatbot/kpi"
          : "http://localhost:8003/chatbot";

      const response = await axios.post(
        apiUrl,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("response", data);

      let reply = data.reply;
      let parsedArray = null;

      // 🔹 Try extracting table data from reply
      const match = reply.match(/\[.*\]/s);
      if (match) {
        try {
          parsedArray = JSON.parse(match[0].replace(/'/g, '"'));
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, table: parsedArray },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Let's Chat
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  margin: "5px 0",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  maxWidth: "90%",
                  background: msg.sender === "user" ? "#2563eb" : "#f1f1f1",
                  color: msg.sender === "user" ? "white" : "black",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Table rendering */}
                {msg.table ? (
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        background: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#e5e7eb", textAlign: "left" }}>
                          {Object.keys(msg.table[0]).map((col, idx) => (
                            <th key={idx} style={cellStyle}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.table.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, j) => (
                              <td key={j} style={cellStyle}>
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  margin: "5px 0",
                  padding: "8px 12px",
                  borderRadius: "15px",
                  background: "#f1f1f1",
                  color: "black",
                  alignSelf: "flex-start",
                  fontStyle: "italic",
                }}
              >
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              style={{
                flex: 1,
                border: "none",
                padding: "10px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const cellStyle = {
  padding: "6px",
  border: "1px solid #ddd",
  fontSize: "12px",
};
