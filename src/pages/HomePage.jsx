import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";

import $api from "../api/api";
import { SECTION_PERMISSIONS } from "../constants/permissions";

import "./HomePage.css";

export const UserDataContext = React.createContext({
  myData: {},
  ws: null,
});

export const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [myData, setMyData] = useState({});
  const [ws, setWs] = useState(null);

  //* WEBSOCKET
  useEffect(() => {
    let ws = null;

    const token = localStorage.getItem("access_token");
    if (token) {
      console.log("Token used for WebSocket:", token);
      ws = new WebSocket(
        `wss://ip-91-227-40-30-92919.vps.hosted-by-mvps.net/api/ws?token=${token}`
      );
      ws.onopen = () => {
        console.log("Connected to the WebSocket");
      };
      setWs(ws);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    $api.get("/users/me/").then((response) => {
      setMyData(response.data);
      console.log("про мене",response.data);
    });
  }, []);

  const formattedTime = `${String(currentTime.getHours()).padStart(
    2,
    "0"
  )}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

  const onExitHomePage = () => {
    if (ws) {
      ws.close();
    }

    // Удалить токены из локального хранилища
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    $api.post("/auth/logout").then((response) => console.log(response));
    console.log("Вихід");
    localStorage.clear();

    window.location.replace("/");
    navigate("/", { replace: true });
  };

  const renderNavLink = (path, label) => {
    const requiredPermissions = SECTION_PERMISSIONS[path.replace("/", "")];
    const userHasPermission =
      myData && myData.permissions && requiredPermissions
        ? requiredPermissions.some((permission) =>
            myData.permissions.includes(permission)
          )
        : false;

    if (!userHasPermission && requiredPermissions.length) return null;

    const fullPath = `/homepage/${path}`;

    return (
      <Link
        to={fullPath}
        className={`admin-btns ${
          location.pathname === fullPath ? "admin-btns-active" : ""
        }`}
      >
        <p className="home-page-header-nav">{label}</p>
      </Link>
    );
  };

  //* WEBSOCETS

  return (
    <div className="admin-header">
      <div className="admin-container-btns">
        <div className="admin-sub-container-btns">
          <img src="/images/logo-use1.png" alt="лого" className="header-logo" />
          <div className="admin-sub-container-nav">
            {renderNavLink("main-page", "Головна")}
            {renderNavLink("users", "Керування користувачами")}
            {renderNavLink("reports", "Звіти")}
            {renderNavLink("statistics", "Статистика")}
            {renderNavLink("chat", "Чат")}

            <div className="admin-container-sub-cont">
              <div className="admin-container-time">{formattedTime}</div>
              <div className="admin-container-icons">
                <button type="button" onClick={onExitHomePage}>
                  <i className="bx bx-exit bx-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserDataContext.Provider value={{ myData, ws }}>
        <Outlet />
      </UserDataContext.Provider>
    </div>
  );
};
