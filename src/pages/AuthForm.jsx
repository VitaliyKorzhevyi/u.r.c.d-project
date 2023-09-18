import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import querystring from "querystring";

import "./AuthForm.css";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = querystring.stringify({
        username,
        password,
      });

      const response = await axios.post(`/auth/login`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      // setUsername('');
      // setPassword('');
      console.log(access_token);
      console.log(refresh_token);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Неверное имя пользователя или пароль");
      console.log(err);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/homepage" />;
  }

  return (
    <div className="auth-container">
      <h2>Авторизация</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};
