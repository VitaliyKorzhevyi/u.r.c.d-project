import React, { useContext, useState, useEffect, useRef } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";
import "./Chat.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { ListBgImage } from "./ListBgImage";

import chatBgImageDefoult from "../../image/chat-bg.jpg";

export const Chat = () => {
  const { ws, myData } = useContext(UserDataContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const messageListRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  const handleBackgroundChange = (backgroundUrl) => {
    setSelectedBackground(backgroundUrl);
  };

  useEffect(() => {
    const storedBackground = localStorage.getItem("selectedBackground");
    if (storedBackground) {
      setSelectedBackground(storedBackground);
    }
  }, []);

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

        // Проверка на chat === "general" перед добавлением сообщения
        if (receivedData.chat === "general") {
          // Если пользователь находится в нижней части чата, устанавливаем shouldScrollToBottom в true
          if (currentScroll >= maxScroll - 10) {
            setShouldScrollToBottom(true);
          }

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
    if (shouldScrollToBottom) {
      scrollToBottom();
      // Сразу же устанавливаем обратно в false, чтобы не прокручивать при каждом изменении сообщений
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (fetching) {
      $api
        .get(`/messages/general?page=${currentPage}&limit=20&sort=-id`)
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
    if (target.scrollTop < 0.4 * target.scrollHeight) {
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
      return "Сьогодні";
    }
    return date;
  };

  const groupedMessages = groupMessagesByDate(messages);

  //* ЦВЕТА

  const userColors = [
    "#FF5733",
    "#FFC300",
    "#4CAF50",
    "#03A9F4",
    "#9C27B0",
    "#795548",
    "#fae100",
    "#9afa00",
    "#3af8bf",
    "#2275e2",
    "#7522e2",
    "#ac0000",
    "#795548",
    "#FF9800",
    "#607D8B",
    "#673AB7",
    "#FF5722",
    "#8BC34A",
    "#00BCD4",
    "#3F51B5",
    "#2196F3",
    "#FF5252",
    "#009688",
    "#F44336",
    "#4CAF50",
  ];

  function getUserColor(userId) {
    const index = userId % userColors.length;
    return userColors[index];
  }

  return (
    <div className="chat-container">
      <div className="select-bg-chat">
        <ListBgImage onBackgroundChange={handleBackgroundChange} />
      </div>

      <div
        className="chat-container-bg"
        style={{
          backgroundImage: selectedBackground
            ? `url(${selectedBackground})`
            : `url(${chatBgImageDefoult})`, // chatBgImageDefoult Замените 'путь_к_фону_по_умолчанию.jpg' на путь к вашему фоновому изображению по умолчанию
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      >
        <ul className="message-list" ref={messageListRef}>
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <React.Fragment key={date}>
              <li className="date-header-group">{formatDate(date)}</li>
              {dateMessages.map((message) => (
                <li
                  key={message.message.id}
                  className={`message ${
                    message.user.id === myData.id
                      ? "my-message"
                      : "other-message"
                  }`}
                  ref={
                    dateMessages[dateMessages.length - 1] === message
                      ? messagesEndRef
                      : null
                  }
                >
                  <div className="cont-chat-info-sms">
                    <p
                      className="cont-chat-info-name"
                      style={{ color: getUserColor(message.user.id) }} // Устанавливаем цвет имени
                    >
                      {message.user.full_name}
                    </p>
                    <p className="cont-chat-info-text">
                      {message.message.text}
                    </p>
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
        <div className="input-area-sms-general">
          {isPickerVisible && (
            <div className="emoji-container-general">
              <Picker
                data={data}
                previewPosition="none"
                locale="uk"
                onEmojiSelect={(e) => {
                  setInputMessage((prevInput) => prevInput + e.native);
                }}
              />
            </div>
          )}
          <input
            className="input-message"
            maxLength={4000}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputMessage.trim() !== "") {
                sendMessage();
              }
            }}
            placeholder="Написати повідомлення..."
            autoComplete="off"
          />
          <i
            className="bx bx-happy bx-sm icons-emoji"
            onClick={() => setPickerVisible(!isPickerVisible)}
          ></i>
          <i
            className={`bx bxs-capsule bx-sm bx-fade-up-hover icons-send ${
              inputMessage.trim() === "" ? "gray-icon" : ""
            }`}
            onClick={sendMessage}
            disabled={inputMessage.trim() === ""}
          ></i>
        </div>
      </div>
    </div>
  );
};
