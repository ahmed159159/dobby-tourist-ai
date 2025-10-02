import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        err => console.error("Location access denied", err)
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome! I’m Dobby 🧙‍♂️
      </h1>
      <ChatBox location={location} />
    </div>
  );
}

export default App;
