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
      setError("Неправильне ім'я користувача, або пароль");
      console.log(err);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/homepage" />;
  }

  return (
    <div className="auth-container">
      <div>
        <img
          src="/images/logo-autorization.png"
          alt="logo"
          className="logo-autorization"
        />
        <h1 className="main-title">єдиний реєстр документів клініки</h1>
        <p className="main-text">клінiка св.луки</p>
      </div>

      <div className="autorization-container">
        <h3 className="autorization-text">Вхід у обліковий запис</h3>
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
            />
          </div>
          <div className="password-input-wrapper">
            <input
              id="forPassword"
              className="form-input"
              placeholder="Пароль"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="autorization-btn">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};
