import React, { useState } from "react";
import Message from "./Message";

function ChatBox({ location }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, location })
    });

    const data = await res.json();
    setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    setInput("");
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-96">
      <div className="h-80 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l-lg px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
