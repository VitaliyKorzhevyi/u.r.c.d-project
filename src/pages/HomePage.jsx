import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { UserManagement } from "../components/UserManagement/UserManagement";
import { Forms } from "../components/Forms/Forms";
import { Archive } from "../components/Archive/Archive";
import { Statistics } from "../components/Statistics/Statistics";
import { Messages } from "../components/Messages/Messages";

import './HomePage.css';

export const HomePage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSection = params.get("section") || localStorage.getItem("section") || "users";
  const [activeSection, setActiveSection] = useState(initialSection);
  

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
          <button type="button" onClick={() => onSectionChange('archive')}>Архів</button>
          <button type="button" onClick={() => onSectionChange('statistics')}>Статистика</button>
          <button type="button" onClick={() => onSectionChange('messages')}>Повідомлення</button>
        </div>
      </div>
      {activeSection === 'users' && <UserManagement />}
      {activeSection === 'forms' && <Forms />}
      {activeSection === 'archive' && <Archive />}
      {activeSection === 'statistics' && <Statistics />}
      {activeSection === 'messages' && <Messages />}
    </div>
  );
};


// const [userData, setUserData] = useState(null);
// const [error, setError] = useState(null);

// const handleFetchUserData = async () => {
//   // отправка access токена после обновления токенов
//   const accessToken = async () => {
//     const access_token = localStorage.getItem("access_token");
//     if (!access_token) {
//       setError("Access token not found.");
//       return;
//     }

//     const instance = axios.create({
//       headers: { Authorization: `Bearer ${access_token}` },
//     });

//     const response = await instance.get("/users/me/");
//     setUserData(response.data);
//     console.log(response.data);
//     return
//   };
//   // отправка токена
//   const access_token = localStorage.getItem("access_token");

//   const instance = axios.create({
//     headers: { Authorization: `Bearer ${access_token}` },
//   });

//   try {
//     const response = await instance.get("/users/me/");
//     setUserData(response.data);
//     console.log(response.data);
//   } catch (error) {
//     // console.error("Error fetching user data:", error);
//     if (error?.response?.status === 401 && error?.response?.data?.detail === "Could not validate credentials") {
//       try {
//         const redirected = await updateTokens();
//         if (!redirected) {
//           setTimeout(() => {
//             accessToken();
//           }, 600);
//         }

//       } catch (error) {
//         setError("Failed to fetch user data.");
//       }
//     } else {
//       setError("Failed to fetch user data.");
//     }
//   }

// };
