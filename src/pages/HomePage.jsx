import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import $api from "../api/api";

import { UserManagement } from "../components/UserManagement/UserManagement";
import { Reports } from "../components/Reports/Reports";
import { Statistics } from "../components/Statistics/Statistics";
import { MainPage } from "../components/MainPage/MainPage";
import { Chat } from "../components/Chat/Chat";

//РОЛІ
import { SECTION_PERMISSIONS } from "../constants/permissions";

import "./HomePage.css";

export const HomePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSection =
    params.get("section") || localStorage.getItem("section") || "users";
  const [activeSection, setActiveSection] = useState(initialSection);

  const [myData, setMyData] = useState({});
  console.log(myData.permissions);
  
  useEffect(() => {
    $api.get("/users/me/").then((response) => {
      console.log("данные о пользователе:", response.data);
      setMyData(response.data);
    });
  }, []);

  const onSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem("section", section);
    const newUrl = `${window.location.pathname}?section=${section}`;
    window.history.replaceState(null, "", newUrl);
  };

  useEffect(() => {
    const currentSection =
      new URLSearchParams(location.search).get("section") ||
      localStorage.getItem("section") ||
      "users";
    setActiveSection(currentSection);
  }, [location.search]);

  const AccessibleButton = ({ section, onClick, children }) => {
    const requiredPermissions = SECTION_PERMISSIONS[section];

    if (!requiredPermissions.length) return (
      <button type="button" className="admin-btns" onClick={onClick}>
        {children}
      </button>
    );

    // Проверяем, есть ли у пользователя хотя бы одно из требуемых разрешений
    const userHasPermission = requiredPermissions.some((permission) =>
    myData.permissions?.includes(permission)
  );


    console.log(userHasPermission);
    if (!userHasPermission) return null;

    return (
      <button type="button" className="admin-btns" onClick={onClick}>
        {children}
      </button>
    );
  };

  return (
    <div className="admin-header">
      <div className="admin-container-btns">
        <img src="/images/logo-use1.png" alt="лого" className="header-logo" />
        <AccessibleButton
          section="main-page"
          onClick={() => onSectionChange("main-page")}
        >
          Головна
        </AccessibleButton>
        <AccessibleButton
          section="users"
          onClick={() => onSectionChange("users")}
        >
          Керування користувачами
        </AccessibleButton>
        <AccessibleButton
          section="reports"
          onClick={() => onSectionChange("reports")}
        >
          Звіти
        </AccessibleButton>
        <AccessibleButton
          section="statistics"
          onClick={() => onSectionChange("statistics")}
        >
          Статистика по медикаментам
        </AccessibleButton>
        <AccessibleButton
          section="chat"
          onClick={() => onSectionChange("chat")}
        >
          Чат
        </AccessibleButton>
      </div>
      {activeSection === "main-page" && <MainPage />}
      {activeSection === "users" && <UserManagement userData={myData} />}
      {activeSection === "reports" && <Reports userData={myData} />}
      {activeSection === "statistics" && <Statistics />}
      {activeSection === "chat" && <Chat />}
    </div>
  );
};
