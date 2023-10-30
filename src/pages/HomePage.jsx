import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";

import { toast } from "react-toastify";

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

  //* уведомления

  useEffect(() => {
    if (location.pathname === "/homepage/main-page") {
      setNewMessageNews(false);
      setNumberOfNews(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/homepage/chat") {
      setNewMessageGeneralChat(false);
      setNumberOfGeneralChat(0);
    }
  }, [location.pathname]);

  const [numberOfNews, setNumberOfNews] = useState(0);
  const [newMessageNews, setNewMessageNews] = useState(false);
  const [numberOfGeneralChat, setNumberOfGeneralChat] = useState(0);
  const [newMessageGeneralChat, setNewMessageGeneralChat] = useState(false);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        console.log("event", event);
        const receivedData = JSON.parse(event.data);
        if (
          receivedData.type === "new" &&
          receivedData.chat === "information"
        ) {
          toast.info("Нове повідомлення у новинах");
          setNewMessageNews(true);
          setNumberOfNews((prevCount) => {
            const newCount = prevCount + 1;
            console.log("Количество true:", newCount);
            return newCount;
          });
        }
        if (receivedData.type === "new" && receivedData.chat === "general") {
          toast.info("Нове повідомлення у чаті");
          setNewMessageGeneralChat(true)
          setNumberOfGeneralChat((prevCount) => {
            const newCount = prevCount + 1;
            console.log("Количество true:", newCount);
            return newCount;
          });
        }
      };
    }
    return () => {
      if (ws) {
        ws.onmessage = null;
      }
    };
  }, [ws]);

  const [kyivTime, setKyivTime] = useState(getKyivTime);

  function getKyivTime() {
    const now = new Date();
    return now.toLocaleString("en-US", {
      timeZone: "Europe/Kiev",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setKyivTime(getKyivTime());
    }, 60000); // Обновляем каждую минуту (60 000 миллисекунд)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    $api.get("/users/me/").then((response) => {
      setMyData(response.data);
      console.log("про мене", response.data);
    });
  }, []);

  const onExitHomePage = () => {
    if (ws) {
      ws.close();
    }
    $api.post("/auth/logout").then((response) => console.log(response));
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

  return (
    <div className="admin-header">
      <div className="news-container-fixed-image"></div>
      <div className="admin-container-btns">
        <div className="admin-sub-container-btns">
          <img src="/images/logo-use1.png" alt="лого" className="header-logo" />
          <div className="admin-sub-container-nav">
            <Link to="/homepage/main-page" className="admin-btns home-link">
              <p
                className={`home-page-header-nav ${
                  location.pathname === "/homepage/main-page"
                    ? "admin-btns-active"
                    : ""
                }`}
              >
                Головна
              </p>
              {newMessageNews ? <p>{numberOfNews}</p> : null}
            </Link>
            {renderNavLink("users", "Управління користувачами")}
            {renderNavLink("reports", "Звіти")}
            {renderNavLink("statistics", "Статистика")}
            <Link to="/homepage/chat" className="admin-btns chat-link">
              <p
                className={`home-page-header-nav ${
                  location.pathname === "/homepage/chat"
                    ? "admin-btns-active"
                    : ""
                }`}
              >
                Чат
              </p>
              {newMessageGeneralChat ? <p>{numberOfGeneralChat}</p> : null}
            </Link>

            <div className="admin-container-sub-cont">
              <div className="admin-container-time">{kyivTime}</div>
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
