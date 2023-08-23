import { useState } from 'react';
import axios from '../../api/axios';
//! додати оновлення токену
import './UserBanCheckbox.css'


const UserBanCheckbox = ({ user_id }) => {
  const [isBanned, setIsBanned] = useState(false);

  const access_token = localStorage.getItem("access_token");

  const instance = axios.create({
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const handleBanUser = async () => {
    try {
        console.log('Отправляемые данные:', { user_id });
        const response = await instance.post(`/users/ban/${user_id}`);
        const message = response.data; 
        console.log('Ответ сервера:', message);
        setIsBanned(true);
    } catch (error) {
      console.error('Ошибка при бане пользователя:', error);
    }
  };

  const handleUnbanUser = async () => {
    try {
        const response = await instance.post(`/users/unban/${user_id}`);
        const message = response.data; // Это будет строкой "string"
        console.log('Ответ сервера:', message);
        setIsBanned(false);
    } catch (error) {
      console.error('Ошибка при разбане пользователя:', error);
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
    <div className='checkbox-ban'>
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