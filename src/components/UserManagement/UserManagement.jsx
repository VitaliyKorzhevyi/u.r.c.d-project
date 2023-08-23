import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { updateTokens } from "../../updateTokens";
import UserBanCheckbox from "./UserBanCheckbox";

import "./UserManagement.css";

const User = ({ user }) => {
  return (
    <div className="user">
      <ul className="info-list">
        <li>
          <p>{user.first_name}</p>
        </li>
        <li>
          <p>{user.last_name}</p>
        </li>
        <li>
          <p>{user.middle_name}</p>
        </li>
        <li>
          <p>{user.job_title}</p>
        </li>
        <li>
          <UserBanCheckbox user_id={user.id} />
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = localStorage.getItem("access_token");

        const instance = axios.create({
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const response = await instance.get("/users?skip=0&limit=99");
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.detail === "Could not validate credentials"
        ) {
          try {
            updateTokens();
            // const redirected = await updateTokens();
            // if (!redirected) {
            //   setTimeout(() => {
            //     accessToken();
            //   }, 600);
            // }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(error);
        }
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
    </div>
  );
};
