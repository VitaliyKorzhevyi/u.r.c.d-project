import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";

import { PERMISSIONS } from "../../constants/permissions";

import "./MainPage.css";

const Modal = ({ onClose, onSendMessage, inputMessage, setInputMessage }) => (
  <div className="modal-create-news">
    <div className="create-news-content">
      <div className="input-area">
        <input
          className="input-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <button className="send-button" onClick={onSendMessage}>
          Відправити
        </button>
        <button onClick={onClose} className="cls-button">
          Закрыть
        </button>
      </div>
    </div>
  </div>
);

export const MainPage = () => {
  const { myData } = useContext(UserDataContext);
  const { ws } = useContext(UserDataContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        // console.log("Пришло новое сообщение:", event.data);
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
    if (fetching) {
      console.log("fetching");
      $api
        .get(`/messages/information?page=${currentPage}&limit=20&sort=-id`)
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
        })
        .finally(() => setFetching(false));
    }
  }, [fetching, currentPage, messages]);


  // currentPage, messages під питанням
  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "create",
        chat: "information",
        text: inputMessage,
      };
      ws.send(JSON.stringify(messagePayload));
      setInputMessage("");
    } else {
      console.error("WebSocket не открыт. Невозможно отправить сообщение.");
    }
  };

  return (
    <div className="news-container">
      {myData?.permissions?.includes(
        PERMISSIONS.CREATE_INFORMATION_MESSAGES
      ) && (
        <div className="container-btn-create-news">
          <button
            className="btn-create-news"
            onClick={() => setShowModal(true)}
          >
            Створити новину
          </button>
        </div>
      )}
      <ul className="message-list-information">
        {messages.map((message, index) => (
          <li
            key={message.message.id}
            className="item-message-information"
            ref={index === messages.length - 1 ? messagesEndRef : null}
          >
            <h2>Дуже важливо щоб ви це прочитали</h2>

            <p className="message-information-text">{message.message.text}</p>
            <div className="message-information-text-up">
              <p className="message-information-data">
                {new Date(message.message.created_at).toLocaleDateString()}{" "}
              </p>
              <p className="message-information-user">
                {message.user.full_name}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSendMessage={sendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
        />
      )}
    </div>
  );
};
