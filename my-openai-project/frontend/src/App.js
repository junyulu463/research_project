import React, { useState } from "react";
import "./App.css"; // Import the CSS file

const App = () => {
  const [input, setInput] = useState(""); // User input state
  const [response, setResponse] = useState(""); // OpenAI response state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });
      const data = await res.json();
      setResponse(data.content); // Update response state with OpenAI output
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error generating response");
    }
  };

  return (
    <div>
      <h1>Chat with OpenAI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit">Send</button>
      </form>
      {response && (
        <div className="response">
          <h3>Response:</h3>
          <div dangerouslySetInnerHTML={{ __html: response }} />
        </div>
      )}
    </div>
  );
};

export default App;
