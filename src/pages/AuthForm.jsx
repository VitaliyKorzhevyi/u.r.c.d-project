import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";
import querystring from "querystring";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./AuthForm.css";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleAuthErrors = (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        const errorData = error.response.data;
        if (errorData && errorData.detail) {
          switch (errorData.detail) {
            case "Invalid email or username":
              return "Невірна електронна адреса або логін";
            case "Invalid password":
              return "Недійсний пароль";
            default:
              return "Помилка авторизації";
          }
        } else {
          return "Помилка авторизації";
        }
      } else if (status === 422) {
        return "Не валідні дані";
      } else if (status === 400) {
        const errorData = error.response.data;
        if (errorData && errorData.detail === "Inactive user") {
          return "Неактивний користувач (заблокований)";
        }
        return "Помилка запиту до сервера";
      } else if (status === 500) {
        return "Помилка серверу";
      } else {
        return "Помилка авторизації";
      }
    } else if (!navigator.onLine) {
      return "Відсутнє з'єднання з інтернетом";
    } else {
      return "Невідома помилка";
    }
  };
  

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
      const errorMessage = handleAuthErrors(err);
      setError(errorMessage);
      console.log(err);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/homepage/main-page" />;
  }

  return (
    <div className="auth-container">
       <h3 className="autorization-text">Вхід у обліковий запис</h3>
      <div className="autorization-container">
        <form onSubmit={onSubmit} className="autorization-form">
          <div className="input-1">
            <label htmlFor="forName"></label>
            <input
              id="forName"
              type="text"
              placeholder="Логін"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="password-input-wrapper">
            <input
              className="form-input"
              placeholder="Пароль"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            />
          </div>
          {error && <p className="err-auth">{error}</p>}
          <button type="submit" className="autorization-btn">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};
