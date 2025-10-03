import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [places, setPlaces] = useState([]);

  // 🧠 إرسال السؤال لـ Dobby
  const askDobby = async () => {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.choices?.[0]?.message?.content || "No answer found");
  };

  // 📍 البحث عن أماكن من Foursquare
  const searchPlaces = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `/api/places?query=${encodeURIComponent(question)}&lat=${latitude}&lon=${longitude}`
      );

      const data = await res.json();
      setPlaces(data.results || []);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🌍 AI Travel Assistant</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="اكتب سؤالك لـ Dobby"
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={askDobby}>اسأل Dobby</button>
      <button onClick={searchPlaces}>ابحث عن أماكن</button>

      <div style={{ marginTop: "20px" }}>
        <h2>إجابة Dobby:</h2>
        <p>{answer}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>📍 أماكن قريبة:</h2>
        <ul>
          {places.map((p) => (
            <li key={p.fsq_id}>
              {p.name} - {p.location?.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
