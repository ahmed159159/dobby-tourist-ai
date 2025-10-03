import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "لم يتم العثور على إجابة");
    } catch (err) {
      setAnswer("حصل خطأ أثناء التواصل مع الخادم");
    }
  };

  return (
    <div style={{ padding: "20px", direction: "rtl", textAlign: "right" }}>
      <h1>👋 مساعد الخروجات الذكي</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="اكتب سؤالك لـ Dobby"
        style={{ padding: "10px", width: "60%", marginRight: "10px" }}
      />
      <button onClick={handleAsk} style={{ padding: "10px 20px" }}>
        اسأل
      </button>
      <div style={{ marginTop: "20px" }}>
        <strong>الإجابة:</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;
