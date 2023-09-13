//todo Тарас мені потрібно, що коли я баню користувача, то він опиняється в кінці списку користувачів, список приходить по алфавіту
import { useState } from "react";
import $api from "../../api/api";
import "./UserBanCheckbox.css";

const UserBanCheckbox = ({ user_id, is_active }) => {
  const [isBanned, setIsBanned] = useState(is_active);

  const handleBanUser = async () => {
    try {
      console.log("Отправляемые данные:", { user_id });
      const response = await $api.post(`/users/${user_id}/ban`);
      const message = response.data;
      console.log("Ответ сервера при бане:", message);
      setIsBanned(true);
    } catch (error) {
      console.error("Ошибка при бане пользователя:", error);
      if (error.response) {
        console.error("Тело ошибки:", error.response.data);
      }
    }
  };

  const handleUnbanUser = async () => {
    try {
      const response = await $api.post(`/users/${user_id}/unban`);
      const message = response.data; 
      console.log("Ответ сервера при разбане:", message);
      setIsBanned(false);
    } catch (error) {
      console.error("Ошибка при разбане пользователя:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      handleBanUser();
    } else {
      handleUnbanUser();
    }
  };

  return (
    <div className="checkbox-ban">
      <label>
        Забанить пользователя {user_id}:
        <input
          type="checkbox"
          checked={isBanned}
          onChange={handleCheckboxChange}
        />
      </label>
    </div>
  );
};

export default UserBanCheckbox;
