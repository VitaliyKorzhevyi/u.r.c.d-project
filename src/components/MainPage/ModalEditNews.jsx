import { useEffect} from "react";


export const ModalEditNews = ({ onClose, onEditMessage, inputMessage, setInputMessage, editingMessage }) => {
    useEffect(() => {
      if (editingMessage) {
        setInputMessage(editingMessage.text);  // здесь берем текст из editingMessage
      }
    }, [editingMessage, setInputMessage]);
  
    return (
      <div className="modal-edit-news">
        <div className="edit-news-content">
          <div className="input-area">
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