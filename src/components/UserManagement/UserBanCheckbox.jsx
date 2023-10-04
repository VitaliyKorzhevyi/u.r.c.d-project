//todo Тарас мені потрібно, що коли я баню користувача, то він опиняється в кінці списку користувачів, список приходить по алфавіту
import { useState } from "react";
import $api from "../../api/api";
import "./UserBanCheckbox.css";

const UserBanCheckbox = ({ user_id, is_active, onClick }) => {
  const [isBanned, setIsBanned] = useState(is_active);

  const onBanUser = async () => {
    try {
      console.log("Отправляемые данные:", { user_id });
      const response = await $api.post(`/users/${user_id}/ban`);
      const message = response.data;
      console.log("Ответ сервера при бане:", message);
      setIsBanned(true);
      onClick && onClick(true);
    } catch (error) {
      console.error("Ошибка при бане пользователя:", error);
      if (error.response) {
        console.error("Тело ошибки:", error.response.data);
      }
    }
  };

  const onUnbanUser = async () => {
    try {
      const response = await $api.post(`/users/${user_id}/unban`);
      const message = response.data;
      console.log("Ответ сервера при разбане:", message);
      setIsBanned(false);
      onClick && onClick(false);
    } catch (error) {
      console.error("Ошибка при разбане пользователя:", error);
    }
  };

  const onCheckboxChange = () => {
    if (!isBanned) {
        onBanUser();
    } else {
        onUnbanUser();
    }
};

  return (
    <div>
      <i
        className={`checkbox-ban bx bx-lock-open-alt bx-sm ${isBanned ? "banned-user" : ""}`}
        onClick={onCheckboxChange}
      ></i>
    </div>
  );
};

export default UserBanCheckbox;
