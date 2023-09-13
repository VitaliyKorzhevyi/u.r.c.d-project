//! 500 помилка при створені нового користувача
//todo створити кнопку + по якій буде відкриватися модалка для створення користувача
//todo створити валідацію для запобігання помилок

import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { updateTokens } from "../../updateTokens";
import UserBanCheckbox from "./UserBanCheckbox";

export const UserCreate = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user_id, setUser_id] = useState(null);

  const onCreateUser = async (e) => {
    e.preventDefault();
    
    const accessToken = async () => {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("Access token not found.");
        return;
      }

      const instance = axios.create({
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = {
        first_name,
        last_name,
        email,
        username,
        password,
      };

      const response = await instance.post("/users/create", data);
      console.log(response.data);
    };

    try {
      const access_token = localStorage.getItem("access_token");

      const instance = axios.create({
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(instance);
      const data = {
        first_name,
        last_name,
        email,
        username,
        password,
      };
      console.log(data);
      const response = await instance.post("/users/create", data);

      setUser_id(response.data.user.id);
      const userId = response.data.user.id;
      console.log("ID пользователя:", userId);
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.detail === "Could not validate credentials"
      ) {
        try {
          // обновление токенов
          updateTokens();
          setTimeout(() => {
            accessToken();
          }, 600);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="create-container">
      <div className="create-user">
        <form onSubmit={onCreateUser}>
          <div>
            <label>first_name</label>
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label>last_name</label>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Створити</button>
        </form>
        <UserBanCheckbox user_id={user_id} />
      </div>
    </div>
  );
};
