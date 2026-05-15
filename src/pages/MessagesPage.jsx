import { useLoaderData } from "react-router";

export function MessagesPage() {
  const { messages } = useLoaderData();

  return (
    <>
      <h1>Messages</h1>

      {messages.map((message) => (
        <div key={`${message.Sender}-${message.Recipient}-${message.messageNum}`}>
          <p>
            <strong>{message.Sender}</strong> to <strong>{message.Recipient}</strong>
          </p>
          <p>{message.Message}</p>
        </div>
      ))}
    </>
  );
}