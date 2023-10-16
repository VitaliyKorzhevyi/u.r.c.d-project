import { useEffect } from "react";

export const ModalEditNews = ({
  onClose,
  onEditMessage,
  inputMessage,
  setInputMessage,
  inputTitle,
  setInputTitle,
  editingMessage,

}) => {

  useEffect(() => {
    if (editingMessage) {
      setInputMessage(editingMessage.text); 
    }
  }, [editingMessage, setInputMessage]);

  return (
    <div className="modal-edit-news">
      <div className="edit-news-content">
        <div className="input-area">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <textarea
            className="input-message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <button className="send-button" onClick={onEditMessage}>
            Зберегти зміни
          </button>
          <button onClick={onClose} className="cls-button">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
