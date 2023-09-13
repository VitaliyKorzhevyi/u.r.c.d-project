
import { useState, useEffect } from "react";
import $api from "../../api/api";
import UserBanCheckbox from "./UserBanCheckbox";

import "./UserManagement.css";

const User = ({ user }) => {
  return (
    <div className="user">
      <ul className="info-list">
        <li>
          <p>{user.full_name}</p>
        </li>
        <li>
          <p>{user.job_title}</p>
        </li>
        <li>
          <UserBanCheckbox user_id={user.id} is_active={!user.is_active}/>
        </li>
        <li>
          <button type="button"> Змінити данні</button>
        </li>
      </ul>
    </div>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  // const [onModalCreateUser, setModalCreateUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await $api.get("/users?skip=0&limit=99");
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Пустой массив зависимостей гарантирует, что запрос будет выполнен только при монтировании компонента

  return (
    <div className="users-container">
      <h2 className="title-users">Данні користувачів</h2>
      <div className="users-list">
        {users.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
      <div>

      </div>
    </div>
  );
};
