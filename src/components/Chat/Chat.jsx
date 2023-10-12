import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";


export const Chat = () => {
  const { ws } = useContext(UserDataContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    $api.get("/messages/general?page=1&limit=30&sort=-id").then((response) => {
      setMessages(response.data.messages.reverse());
    });
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const incomingMessage = JSON.parse(event.data);
        const currentScroll = messagesEndRef.current?.parentNode?.scrollTop || 0;
        const maxScroll = messagesEndRef.current?.parentNode?.scrollHeight - messagesEndRef.current?.parentNode?.clientHeight || 0;
      
        if (currentScroll >= maxScroll - 10) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }

        setMessages((prev) => [...prev, incomingMessage]);
      };
    }
  }, [ws]);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "create",
        chat: "general",
        text: inputMessage,
      };
      ws.send(JSON.stringify(messagePayload));
      setInputMessage("");
    } else {
      console.error("WebSocket не открыт. Невозможно отправить сообщение.");
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);
  return (
    <div className="chat-container">
      <p>чат</p>
      <ul className="message-list">
        {messages.map((message, index) => (
          <li
            key={message.message.id}
            className="message"
            ref={index === messages.length - 1 ? messagesEndRef : null}
          >
            <p>{message.user.full_name}</p>
            <p>{message.message.text}</p>
          </li>
        ))}
      </ul>
      <div className="input-area">
        <input
          className="input-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <button className="send-button" onClick={sendMessage}>
          Відправити
        </button>
      </div>
    </div>
  );
};
