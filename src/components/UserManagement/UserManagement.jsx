import { useState, useEffect, useRef  } from "react";
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
          <UserBanCheckbox user_id={user.id} is_active={!user.is_active} />
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
  const [childRight, setChildRight] = useState(0);
  const parentRef = useRef(null);

  const setChildPosition = () => {
    if (parentRef.current) {
      const parentRightEdge = parentRef.current.getBoundingClientRect().right + window.scrollX;
      setChildRight(window.innerWidth - parentRightEdge);
    }
  };

  useEffect(() => {
    setChildPosition(); // установить начальное положение
    window.addEventListener('resize', setChildPosition);
    window.addEventListener('scroll', setChildPosition);

    // Очистка обработчиков при размонтировании компонента
    return () => {
      window.removeEventListener('resize', setChildPosition);
      window.removeEventListener('scroll', setChildPosition);
    };
  }, []); 
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
    <div className="users-container" ref={parentRef}>
      <h2 className="title-users">Данні користувачів</h2>
      <div className="users-list">
        {users.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
      <div className="container-btn-create-new-users" style={{ right: childRight }}>
        <button type="button" className="create-new-user">
        <i className="bx bx-plus bx-sm"></i>
        </button>
      </div>
    </div>
  );
};
