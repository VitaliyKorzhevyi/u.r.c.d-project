import { useState } from "react";
import { toast } from "react-toastify";
import $api from "../../api/api";

import "./EditUserModal.css";

export const EditUserModal = ({ isOpen, onClose, afterCreate, userData }) => {
  const [first_name, setFirstName] = useState(userData.first_name || "");
  const [last_name, setLastName] = useState(userData.last_name || "");
  const [middle_name, setMiddleName] = useState(userData.middle_name || "");
  const [birthday, setBirthday] = useState(userData.birthday || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [email, setEmail] = useState(userData.email || "");
  const [job_title, setJobTitle] = useState(userData.job_title || "");
  const [username, setUsername] = useState(userData.username || "");
  const [password, setPassword] = useState("");

  const onPasswordUser = () => {
    const data = {
      password: password,
    };

    const userId = userData.id;
    const URL = `/users/${userId}`;
    $api
      .patch(URL, data)
      .then((response) => {
        console.log(response);
          toast.success(`Пароль успішно оновлено`, {
            autoClose: 1500,
          });
          onClose();
          if (afterCreate) afterCreate();
        
      })
      .catch((error) => {
        console.log(error);
      });

  };

  const onEditUser = () => {
    const data = {
      first_name: first_name || null,
      last_name: last_name || null,
      middle_name: middle_name || null,
      birthday: birthday || null,
      phone: phone || null,
      email: email || null,
      job_title: job_title || null,
      username: username || null,
    };

    const userId = userData.id;
    const URL = `/users/${userId}`;
    $api
      .put(URL, data)
      .then((response) => {
        console.log(response);
        const userId = response.data.id;
        if (selectedRoles.length > 0) {
          // Проверка на наличие выбранных ролей
          changeUserRole(userId);
        } else {
          toast.success(`Дані користувача успішно оновлено`, {
            autoClose: 1500,
          });
          onClose();
          if (afterCreate) afterCreate();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeUserRole = (userId) => {
    const rolesData = { roles: selectedRoles };
    const URL = `/users/${userId}/change-role`;
    console.log("на бек", rolesData);
    $api
      .patch(URL, rolesData)
      .then((response) => {
        console.log("Roles updated:", response);
        toast.success(`Дані користувача успішно оновлено`, {
          autoClose: 1500,
        });
        onClose();
        if (afterCreate) afterCreate();
      })
      .catch((error) => {
        console.log("Error updating roles:", error);
      });
  };

  //* ВИБІР РОЛІ

  const ROLES = [
    "head_doctor",
    "accounting",
    "pharmacy",
    "anesthesiology",
    "surgery",
    "operating",
    "resuscitation",
  ];

  const ROLES_TRANSLATIONS = {
    head_doctor: "Головний лікар",
    accounting: "Бухгалтерія",
    pharmacy: "Аптека",
    anesthesiology: "Анестезіологія",
    surgery: "Хірургія",
    operating: "Операційна",
    resuscitation: "Реанімація",
  };

  const [selectedRoles, setSelectedRoles] = useState(
    userData.advanced_roles || []
  );

  console.log("Выбранные роли:", selectedRoles);

  const handleCheckboxChange = (role) => {
    if (selectedRoles.includes(role)) {
      // Если роль уже выбрана, удаляем ее из списка
      setSelectedRoles((prevRoles) => prevRoles.filter((r) => r !== role));
    } else {
      // Иначе добавляем роль в список
      setSelectedRoles((prevRoles) => [...prevRoles, role]);
    }
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-edit-user">
      <div className="modal-content-edit-user">
        <div
          className="btn-close-modal"
          onClick={() => {
            onClose();
          }}
        >
          <img src="/images/cross.svg" alt="Х" className="logo-autorization" />
        </div>
        <p className="modal-create-user-title">Оновити користувача</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEditUser();
          }}
          className="modal-create-user-list"
        >
          <div className="modal-content-big-group">
            <div className="modal-content-group">
              <input
                type="text"
                placeholder="Прізвище"
                value={last_name}
                onChange={(e) => setLastName(capitalize(e.target.value))}
              />
              <input
                type="text"
                placeholder="Ім'я"
                value={first_name}
                onChange={(e) => setFirstName(capitalize(e.target.value))}
              />
            </div>
            <div className="modal-content-group">
              <input
                type="text"
                placeholder="По батькові"
                value={middle_name}
                onChange={(e) => setMiddleName(capitalize(e.target.value))}
              />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            <div className="modal-content-group">
              <input
                type="tel"
                value={phone}
                placeholder="Телефон"
                onChange={(e) => {
                  if (/^[+\d]+$/.test(e.target.value)) {
                    if (e.target.value[0] !== "+") {
                      setPhone("+" + e.target.value);
                    } else {
                      setPhone(e.target.value);
                    }
                  }
                }}
              />
              <input
                type="email"
                placeholder="Пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="modal-content-group">
              <input
                type="text"
                placeholder="Посада"
                value={job_title}
                onChange={(e) => setJobTitle(capitalize(e.target.value))}
              />
              <input
                type="text"
                placeholder="Логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-list-role-create">
            {ROLES.map((role) => (
              <div key={role}>
                <label className="modal-list-role-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleCheckboxChange(role)}
                  />
                  {ROLES_TRANSLATIONS[role] || role}
                </label>
              </div>
            ))}
          </div>
          <button type="submit" className="modal-create-user-btn">
            Оновити
          </button>
          <div className="modal-content-password">
            <input
              type="text"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="modal-edit-user-btn-password" onClick={onPasswordUser}>
              Змінити пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
