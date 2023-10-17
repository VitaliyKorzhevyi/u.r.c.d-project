import { toast } from "react-toastify";

export const ModalCreateNews = ({
  onClose,
  onSendMessage,
  inputMessage,
  setInputMessage,
  inputTitle,
  setInputTitle,
}) => {

  const isInputTitleValid = inputTitle.length <= 500;
  const isInputMessageValid = inputMessage.length >= 1 && inputMessage.length <= 4000;

  const handleCreateNews = () => {
    if (isInputTitleValid && isInputMessageValid) {
      onSendMessage();
    } else {
      // Вы можете добавить логику для отображения сообщений об ошибках
      if (inputTitle.length > 500) {
        toast.info(
          "Заголовок не повинен перевищувати 500 символів."
        );
      }
      if (inputMessage.length < 1) {
        toast.info(
          "Текст новини повинен містити принаймні 1 символ."
        );
      }
      if (inputMessage.length > 4000) {
        toast.info(
          "Текст новини не повинен перевищувати 4000 символів."
        );
      }
    }
  };

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
          <p className="name-modal-create-news">Створити новину</p>
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
          <button className="btn-form-create-news" onClick={handleCreateNews}>
            Створити
          </button>
        </div>
      </div>
    </div>
  );
};
