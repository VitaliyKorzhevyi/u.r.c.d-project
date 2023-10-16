export const ModalCreateNews = ({
  onClose,
  onSendMessage,
  inputMessage,
  setInputMessage,
  inputTitle,
  setInputTitle,
}) => {
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
          <input
            className="form-create-news-title"
            type="text"
            placeholder="Заголовок"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
          />
          <textarea
            className="form-create-news-message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Текст новини..."
            autoComplete="off"
            rows="5"
            cols="50"
          />
          <button className="btn-form-create-news" onClick={onSendMessage}>
            Відправити
          </button>
        </div>
      </div>
    </div>
  );
};
