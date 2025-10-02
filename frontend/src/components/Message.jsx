import React from "react";

function Message({ role, content }) {
  return (
    <div className={`my-2 ${role === "user" ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block px-3 py-2 rounded-lg ${
          role === "user"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {content}
      </span>
    </div>
  );
}

export default Message;
