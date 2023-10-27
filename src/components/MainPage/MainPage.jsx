import { useContext, useState, useEffect, useRef } from "react";
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
  const [inputTitle, setInputTitle] = useState("");
  const messagesEndRef = useRef(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const formatText = (text) => {
    return text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log("event",event);
        if (receivedData.chat === "information") {
          if (receivedData.type === "updated") {
            console.log("оновлення", receivedData.type);
             const updatedMessages = messages.map((message) =>
               message.message.id === receivedData.message.id
                 ? receivedData
                 : message
             );
             setMessages(updatedMessages);
           } 
          if (receivedData.type === "new") {
            setMessages((prevMessages) => [...prevMessages, receivedData]);
          } 
          if (receivedData.type === "deleted") {
            // Если тип сообщения "delete", удалите сообщение по ID
            setMessages((prevMessages) =>
              prevMessages.filter(
                (message) => message.message.id !== receivedData.message.id
              )
            );
          }
        }
      };
    }
  
    // Очистите обработчик при размонтировании компонента
    return () => {
      if (ws) {
        ws.onmessage = null;
      }
    };
  }, [ws, messages]);

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
    const titleToSend = inputTitle.trim() === "" ? "Новина" : inputTitle;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "create",
        title: titleToSend,
        chat: "information",
        text: inputMessage,
      };
      ws.send(JSON.stringify(messagePayload));
      setInputTitle("");
      setInputMessage("");
    } else {
      console.error("WebSocket не открыт. Невозможно отправить сообщение.");
    }
  };

  const editMessage = () => {
    console.log("Текст:", inputMessage);
    console.log("Title1:", inputTitle);

    console.log("ID:", editingMessage.id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "update",
        chat: "information",
        title: inputTitle,
        text: inputMessage, // это редактированный текст
        message_id: editingMessage.id, // здесь берем ID из editingMessage
      };

      ws.send(JSON.stringify(messagePayload));

      setInputTitle("");
      setInputMessage("");
      setShowModalEdit(false);
      // Закрыть модальное окно после отправки сообщения
    } else {
      console.error("WebSocket не открыт. Невозможно отправить сообщение.");
    }
  };

  const showDeleteModal = (message) => {
    setShowDeleteConfirmation(true);
    setMessageToDelete(message);
  };

  const deleteMessage = (messageId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messagePayload = {
        method: "delete",
        chat: "information",
        message_id: messageId, // Pass the message ID to delete
      };
      ws.send(JSON.stringify(messagePayload));
      setShowDeleteConfirmation(false);
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
        {messages
          .filter(
            (message, index, self) =>
              self.findIndex((m) => m.message.id === message.message.id) ===
              index
          )
          .map((message, index) => (
            <li
              key={message.message.id}
              className="item-message-information"
              ref={index === messages.length - 1 ? messagesEndRef : null}
            >
              <h2>{message.message.title}</h2>

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
              {message.user.id === myData.id && (
                <div className="btns-management-news-cont">
                  <button
                    className="btn-management-news"
                    onClick={() => {
                      setShowModalEdit(true);
                      setEditingMessage({
                        id: message.message.id,
                        text: message.message.text,
                        title: message.message.title, // Добавьте title в editingMessage
                      });
                      setInputTitle(message.message.title); // Установите inputTitle
                    }}
                  >
                    Редагувати
                  </button>
                  <button
                    className="btn-management-news"
                    onClick={() => showDeleteModal(message.message.id)}
                  >
                    Видалити
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>
      {showDeleteConfirmation && (
        <div className="delete-confirmation-modal">
          <p>Видалити цю новину?</p>
          <div className="btn-modal-dlt-news">
            <button onClick={() => setShowDeleteConfirmation(false)}>Ні</button>
            <button onClick={() => deleteMessage(messageToDelete)}>Так</button>
          </div>
        </div>
      )}
      {showModalEdit && (
        <ModalEditNews
          onClose={() => {
            setShowModalEdit(false);
            setEditingMessage(null);
          }}
          onEditMessage={editMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
          editingMessage={editingMessage}
        />
      )}
      {showModalCreate && (
        <ModalCreateNews
          onClose={() => setShowModalCreate(false)}
          onSendMessage={sendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          inputTitle={inputTitle}
          setInputTitle={setInputTitle}
        />
      )}
    </div>
  );
};
