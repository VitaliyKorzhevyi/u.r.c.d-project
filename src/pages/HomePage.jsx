import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import $api from "../api/api";

import { UserManagement } from "../components/UserManagement/UserManagement";
import { Reports } from "../components/Reports/Reports";
import { Statistics } from "../components/Statistics/Statistics";
import { MainPage } from "../components/MainPage/MainPage";
import { CreateNews } from "../components/CreateNews/CreateNews";

//РОЛІ
import { ACCESS_RULES, DEFAULT_ACCESS_RULES } from "../constants/roles";

import "./HomePage.css";

export const HomePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSection =
    params.get("section") || localStorage.getItem("section") || "users";
  const [activeSection, setActiveSection] = useState(initialSection);

  const [myData, setMyData] = useState({});

  useEffect(() => {
    $api.get("/users/me/").then((response) => {
      console.log('данные о пользователе:', response.data);
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

  const AccessibleButton = ({ roles, defaultRoles, onClick, children }) => {
    const userHasRoleAccess =
      roles.length === 0 ||
      roles.some((role) => myData.advanced_roles?.includes(role));
    const userHasDefaultRoleAccess =
      !defaultRoles || defaultRoles.includes(myData.default_role);

    if (!userHasRoleAccess || !userHasDefaultRoleAccess) return null;

    return (
      <button type="button" className="admin-btns" onClick={onClick}>
        {children}
      </button>
    );
  };

  return (
    <div className="admin-header">
      <div className="admin-container-btns">
        <AccessibleButton
          roles={[]}
          onClick={() => onSectionChange("main-page")}
        >
          Головна
        </AccessibleButton>
        <AccessibleButton
          roles={ACCESS_RULES.USERS}
          defaultRoles={DEFAULT_ACCESS_RULES.USERS}
          onClick={() => onSectionChange("users")}
        >
          Керування користувачами
        </AccessibleButton>
        <AccessibleButton
          roles={ACCESS_RULES.REPORTS}
          onClick={() => onSectionChange("reports")}
        >
          Звіти
        </AccessibleButton>
        <AccessibleButton
          roles={ACCESS_RULES.STATISTICS}
          onClick={() => onSectionChange("statistics")}
        >
          Статистика по медикаментам
        </AccessibleButton>
        <AccessibleButton
          roles={ACCESS_RULES.CREATE_NEWS}
          defaultRoles={DEFAULT_ACCESS_RULES.CREATE_NEWS}
          onClick={() => onSectionChange("create-news")}
        >
          Створити новину
        </AccessibleButton>
      </div>
      {activeSection === "main-page" && <MainPage />}
      {activeSection === "users" && <UserManagement />}
      {activeSection === "reports" && <Reports userData={myData}/>}
      {activeSection === "statistics" && <Statistics />}
      {activeSection === "create-news" && <CreateNews />}
    </div>
  );
};
