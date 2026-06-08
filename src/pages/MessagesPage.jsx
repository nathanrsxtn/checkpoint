import { useLoaderData } from "react-router";
import { useState } from "react";
import "./MessagesPage.css";

export function MessagesPage() {
  const { messages, users } = useLoaderData();
  const [messageList, setMessageList] = useState(messages);
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const user = JSON.parse(localStorage.getItem("User"));
  if(!user){
    return(
      <>
      <h1>Messages</h1>
      <p>You must be logged in to view messages.</p>
        </>
    );
  }
  const currentUsername = `@${user.username}`;

  // gets all users and returns a list of their usernames to message
  const people = (users || [])
    .filter((person) => person._id !== user.id)
    .map((person) => `@${person.username}`);

  // gets all friends (people user follows) from DB
  const friends = (users || [])
  .filter((person) => user.followingIds && user.followingIds.includes(person._id))
  .map((person) => `@${person.username}`);

  const selectedMessages = messageList.filter(
    (message) =>
      selectedUser &&
      ((message.Sender === currentUsername && message.Recipient === selectedUser) ||
        (message.Sender === selectedUser && message.Recipient === currentUsername)),
  );

  // for searching a specific user
  const handleSearchUser = () => {
  const typedUsername = searchInput.trim().replace("@", "");

  const foundUser = (users || []).find(
    (person) => person.username.toLowerCase() === typedUsername.toLowerCase()
  );

  if (!foundUser || foundUser._id === user.id) {
    alert("User not found.");
    return;
  }

  setSelectedUser(`@${foundUser.username}`);
  setSearchInput("");
};

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    let recipient = selectedUser || "";
    let messageText = input.trim();
    if (messageText.startsWith("@")) {
      //everything a space after the first @ word is the message
      const firstSpaceIndex = input.indexOf(" ");
      if (firstSpaceIndex !== -1) {
        recipient = input.slice(0, firstSpaceIndex);
        messageText = input.slice(firstSpaceIndex + 1).trim();
      } else {
        recipient = input.trim();
        messageText = "";
      }
    }
    if (!messageText || !recipient) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageNum: Date.now(), Sender: currentUsername, Recipient: recipient, Message: messageText }),
      });

      if (!response.ok) {
        console.error("Failed to send message");
        return;
      }

      const data = await response.json();
      setMessageList((prevMessages) => [...prevMessages, data.data]);
      setSelectedUser(recipient);
      setInput("");
    } catch (error) {
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

            <div className="search-controls">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter username"
              />

              <button className="search-button" onClick={handleSearchUser}>
                Search
              </button>
            </div>
          </div>

          <div className="friends">
            <h1>Friends</h1>

            {friends.map((friend) => (
              <button
                className={`person-item ${
                  selectedUser === friend ? "active-person" : ""
                }`}
                key={friend}
                onClick={() => setSelectedUser(friend)}
              >
                <p>
                  <strong>{friend}</strong>
                </p>
              </button>
            ))}
          </div>

          <div className="people">
            <h1>People</h1>

            {people.map((person) => (
              <button
                className={`person-item ${
                  selectedUser === person ? "active-person" : ""
                }`}
                key={person}
                onClick={() => setSelectedUser(person)}
              >
                <p>
                  <strong>{person}</strong>
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="right-side">
          <div className="expanded-message">
            <h1>Expanded Message</h1>

            <div className="expanded-message-body">
              {selectedUser ? (
                selectedMessages.map((message) => {
                  const isMine = message.Sender === currentUsername;

                  return (
                    <div
                      key={message._id || message.messageNum}
                      className={`message-row ${
                        isMine ? "mine" : "theirs"
                      }`}
                    >
                      <div className="message-bubble">
                        <div className="message-sender">
                          {isMine ? "You" : message.Sender}
                        </div>

                        <div className="message-text">
                          {message.Message}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Select a person to view message</p>
              )}
            </div>

            <div className="input-section">
              <input
                id="message-field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here"
              />

              <button
                className="send-button"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
