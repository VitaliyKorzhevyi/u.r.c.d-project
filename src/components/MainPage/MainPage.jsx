import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";

import { PERMISSIONS } from "../../constants/permissions";

import { ModalCreateNews } from "./ModalCreateNews";
import { ModalEditNews } from "./ModalEditNews";
import "./MainPage.css";

export const MainPage = () => {
  const { myData } = useContext(UserDataContext);
  const { ws } = useContext(UserDataContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);

  const formatText = (text) => {
    return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  };
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        
        // Проверка на наличие ошибки в данных
        if (receivedData.message === "Access is denied. One of the following permissions is required") {
          console.error(receivedData.message);
          // Дополнительные действия для обработки ошибки (если необходимо)
        } else {
          // Обработка нормального сообщения
          setMessages((prevMessages) => [...prevMessages, receivedData]);
        }
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

  const editMessage = () => {
    console.log("Текст:", inputMessage);
    console.log("ID:", editingMessage.id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "update",
        chat: "information",
        text: inputMessage, // это редактированный текст
        message_id: editingMessage.id, // здесь берем ID из editingMessage
      };

      ws.send(JSON.stringify(messagePayload));
      setInputMessage("");
      setShowModalEdit(false); // Закрыть модальное окно после отправки сообщения
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
            onClick={() => setShowModalCreate(true)}
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

            <p
              className="message-information-text"
              dangerouslySetInnerHTML={{
                __html: formatText(message.message.text),
              }}
            />
            <div className="message-information-text-up">
              <p className="message-information-data">
                {new Date(message.message.created_at).toLocaleDateString(
                  "uk-UA",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}{" "}
                (
                {new Date(message.message.created_at).toLocaleTimeString(
                  "uk-UA",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
                )
              </p>
              <p className="message-information-user">
                {message.user.full_name}
              </p>
            </div>
            <div>
              {/* <button
                className="btn-create-news"
                onClick={() => {
                  setShowModalEdit(true);
                  setEditingMessage({
                    id: message.message.id,
                    text: message.message.text,
                  });
                }}
              >
                редагувати повідомлення
              </button> */}
            </div>
          </li>
        ))}
      </ul>
      {showModalEdit && (
        <ModalEditNews
          onClose={() => {
            setShowModalEdit(false);
            setEditingMessage(null); // сброс после закрытия модального окна
          }}
          onEditMessage={editMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          editingMessage={editingMessage}
        />
      )}
      {showModalCreate && (
        <ModalCreateNews
          onClose={() => setShowModalCreate(false)}
          onSendMessage={sendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
        />
      )}
    </div>
  );
};
