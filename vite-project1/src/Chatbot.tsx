import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Function to send user message to backend
  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Append user message to chat
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/finance_chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();

      // Append bot response to chat
      setMessages([...newMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="w-50  mx-auto bg-gray-100 shadow-lg rounded-lg p-4">
      <div className="h-80 overflow-y-auto bg-white p-3 border rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
            <div
              className={`p-2 max-w-xs text-white rounded-lg ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-500"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-lg"
          onClick={sendMessage}
        >
          <FaPaperPlane size={22} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
