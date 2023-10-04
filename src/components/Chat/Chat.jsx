import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import $api from "../../api/api";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    $api.get("/messages?page=1&limit=30&chat=general").then((response) => {
      console.log(response.data.messages);
      setMessages(response.data.messages.reverse());
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const websocket = new WebSocket(
      `wss://ip-91-227-40-30-92919.vps.hosted-by-mvps.net/api/ws?token=${token}`);

    websocket.onopen = () => {
      console.log("Connected to the WebSocket");
    };

    websocket.onmessage = (event) => {
      console.log("Ответ с сервера:", event.data);
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

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        chat: "general",
        text: inputMessage,
      };
      console.log(messagePayload);
      ws.send(JSON.stringify(messagePayload));
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
      <ul className="message-list">
        {messages.map((message, index) => (
          <li key={message.id} className="message" ref={index === messages.length - 1 ? messagesEndRef : null}>
            <p>{message.user.full_name}</p>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
      <div className="input-area">
        <input
          className="input-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="send-button"
          onClick={() => {
            sendMessage();
            setInputMessage("");
          }}
        >
          Відправити
        </button>
      </div>
    </div>
  );
};

