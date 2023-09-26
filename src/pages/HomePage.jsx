import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// import $api from "../api/api";

import { UserManagement } from "../components/UserManagement/UserManagement";
import { Forms } from "../components/Forms/Forms";
import { SavedForms } from "../components/SavedForms/SavedForms";
import { Statistics } from "../components/Statistics/Statistics";
import { Messages } from "../components/Messages/Messages";
import { Archive } from "../components/Archive/Archive";
import { Pharmacy } from "../components/Pharmacy/Pharmacy";




import './HomePage.css';

export const HomePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSection = params.get("section") || localStorage.getItem("section") || "users";
  const [activeSection, setActiveSection] = useState(initialSection);

  // const [myData, setMyData] = useState(initialSection);
  
  // useEffect(() => {
  //   $api.get("/users/me/").then((response) => {
  //     console.log(response.data);
  //     setMyData(response.data);
  //   });
  // }, []);


  const onSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem("section", section); // сохраняем в localStorage
    const newUrl = `${window.location.pathname}?section=${section}`;
    window.history.replaceState(null, '', newUrl);
  };

  useEffect(() => {
    const currentSection = new URLSearchParams(location.search).get("section") || localStorage.getItem("section") || "users";
    setActiveSection(currentSection);
  }, [location.search]);

  return (
    <div>
      <div className="admin-header">
        <div className="admin-buttons">
          <button type="button" onClick={() => onSectionChange('users')}>Керування користувачами</button>
          <button type="button" onClick={() => onSectionChange('forms')}>Форми</button>
          <button type="button" onClick={() => onSectionChange('saved-forms')}>Збережені форми</button>
          <button type="button" onClick={() => onSectionChange('statistics')}>Статистика</button>
          <button type="button" onClick={() => onSectionChange('messages')}>Повідомлення</button>
          <button type="button" onClick={() => onSectionChange('archive')}>Архів</button>
          <button type="button" onClick={() => onSectionChange('pharmacy')}>Аптека</button>
        </div>
      </div>
      {activeSection === 'users' && <UserManagement />}
      {activeSection === 'forms' && <Forms />}
      {activeSection === 'saved-forms' && <SavedForms />}
      {activeSection === 'statistics' && <Statistics />}
      {activeSection === 'messages' && <Messages />}
      {activeSection === 'archive' && <Archive />}
      {activeSection === 'pharmacy' && <Pharmacy />}
    </div>
  );
};
