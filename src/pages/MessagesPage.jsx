import { useLoaderData } from "react-router";
import { useState } from "react";
import "./MessagesPage.css"


export function MessagesPage() {
  const { messages } = useLoaderData();
  const [messageList, setMessageList] = useState(messages);
  const [input, setInput] = useState("");
 
  const user = JSON.parse(localStorage.getItem("User"));


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    let recipient = "";
    let messageText = input.trim();
    if(input.startsWith("@")){
      //everything a space after the first @ word is the message
      const firstSpaceIndex = input.indexOf(" ");
      if(firstSpaceIndex !== -1){
        recipient = input.slice(0, firstSpaceIndex);
        messageText = input.slice(firstSpaceIndex + 1).trim();
      } else {
        recipient = input.trim();
        messageText = "";
      }
    }
    if(!messageText) return;

    try {
      
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageNum: Date.now(), Sender: `@${user.username}`, Recipient: recipient, Message: messageText }),
      });

      if(!response.ok){
        console.error("Failed to send message");
        return;
      }

      const data = await response.json();
      setMessageList((prevMessages) => [...prevMessages, data.data]);
      setInput("");
    } catch(error) {
      console.error("Send message error: ", error);
    }
  };

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

            {messageList.map((message) => (
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