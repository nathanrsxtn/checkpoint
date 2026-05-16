import { useLoaderData } from "react-router";
import { useState } from "react";
import "./MessagesPage.css"

export function MessagesPage() {
  const { messages } = useLoaderData();
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setInput("");
  }

  return (
    <>
      <h1>Messages</h1>
      <div className="messages-page">
        <div className="left-side">
          <div className="search">
            <h1>Search</h1>
          </div>

          <div className="groups">
            <h1>Groups</h1>
          </div>

          <div className="people">
            <h1>People</h1>

            {messages.map((message) => (
            <div className="message" key={`${message.Sender}-${message.Recipient}-${message.messageNum}`}>
              <p>
                <strong>{message.Sender}</strong> to <strong>{message.Recipient}</strong>
              </p>
              <p>{message.Message}</p>
            </div>
            ))}
          </div>
        </div>

        <div className="right-side">
          <div className="expanded-message">
            <h1>Expanded Message</h1>

            <div className="expanded-message-body">
              message
            </div>

            <div className="input-section">
              <input
                id="message-field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here"
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}