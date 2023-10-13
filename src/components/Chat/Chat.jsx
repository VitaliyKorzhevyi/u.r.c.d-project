import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";

import "./Chat.css";
export const Chat = () => {
  const { ws, myData } = useContext(UserDataContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const messageListRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const scrollToBottom = () => {
    const messageListElement = messageListRef.current;
    if (messageListElement) {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    }
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);

        const messageListElement = messageListRef.current;
        const currentScroll = messageListElement?.scrollTop || 0;
        const maxScroll =
          messageListElement?.scrollHeight - messageListElement?.clientHeight ||
          0;

        // Если пользователь находится в нижней части чата, устанавливаем shouldScrollToBottom в true
        if (currentScroll >= maxScroll - 10) {
          setShouldScrollToBottom(true);
        }

        setMessages((prevMessages) => [...prevMessages, receivedData]);
      };
    }

    // Очистите обработчик при размонтировании компонента
    return () => {
      if (ws) {
        ws.onmessage = null;
      }
    };
  }, [ws]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      // Сразу же устанавливаем обратно в false, чтобы не прокручивать при каждом изменении сообщений
      setShouldScrollToBottom(false);
    }
  }, [messages]);

  useEffect(() => {
    if (fetching) {
      $api
        .get(`/messages/general?page=${currentPage}&limit=30&sort=-id`)
        .then((response) => {
          const newMessages = response.data.messages
            .reverse()
            .filter(
              (newMessage) =>
                !messages.some(
                  (existingMessage) =>
                    existingMessage.message.id === newMessage.message.id
                )
            );
          setMessages((prevMessages) => [...newMessages, ...prevMessages]);
          setCurrentPage((prevState) => prevState + 1);

          // Если это первая загрузка, установите shouldScrollToBottom в true
          if (initialLoad) {
            setShouldScrollToBottom(true);
            setInitialLoad(false); // Установите initialLoad в false после первой загрузки
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching, currentPage, messages, initialLoad]);

  // currentPage, messages під питанням
  useEffect(() => {
    const messageListElement = messageListRef.current;
    if (messageListElement) {
      messageListElement.addEventListener("scroll", scrollHandler);
    }

    return () => {
      if (messageListElement) {
        messageListElement.removeEventListener("scroll", scrollHandler);
      }
    };
  }, []);

  const scrollHandler = (e) => {
    const target = e.target;
    if (target.scrollTop < 0.1 * target.scrollHeight) {
      console.log("Reached near the top!");
      setFetching(true);
    }
  };

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

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.message.created_at).toLocaleDateString(
        "uk-UA"
      );
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };

  const formatDate = (date) => {
    const today = new Date().toLocaleDateString("uk-UA");
    if (date === today) {
      return "Сегодня";
    }
    return date;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-container">
      <p></p>
      <ul className="message-list" ref={messageListRef}>
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            <li className="date-header-group">{formatDate(date)}</li>
            {dateMessages.map((message) => (
              <li
                key={message.message.id}
                className={`message ${
                  message.user.id === myData.id ? "my-message" : "other-message"
                }`}
                ref={
                  dateMessages[dateMessages.length - 1] === message
                    ? messagesEndRef
                    : null
                }
              >
                <div className="cont-chat-info-sms">
                  <p className="cont-chat-info-name">{message.user.full_name}</p>
                  <p>{message.message.text}</p>
                  <p className="message-general-data">
                    {new Date(message.message.created_at).toLocaleTimeString(
                      "uk-UA",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div className="input-area">
        <input
          className="input-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message.dd.."
          autoComplete="off"
        />
        <button className="send-button" onClick={sendMessage}>
          Відправити
        </button>
      </div>
    </div>
  );
};
