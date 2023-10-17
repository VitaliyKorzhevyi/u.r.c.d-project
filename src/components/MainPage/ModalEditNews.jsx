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
    <div className="modal-create-news">
      <div className="create-news-content">
        <div className="form-create-news-content">
        <div className="btn-close-modal-create-news" onClick={onClose}>
            <img
              src="/images/cross.svg"
              alt="Х"
              className="logo-autorization"
            />
          </div>
          <p className="name-modal-create-news">Редагувати новину</p>
          <input
          className="form-create-news-title"
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <textarea
            className="form-create-news-message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <button className="btn-form-create-news" onClick={onEditMessage}>
            Зберегти зміни
          </button>
        </div>
      </div>
    </div>
  );
};
