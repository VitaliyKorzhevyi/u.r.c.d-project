import { useState } from "react";
import { toast } from "react-toastify";
import $api from "../../api/api";

import "./CreateUserModal.css";

export const CreateUserModal = ({ isOpen, onClose, afterCreate }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onCreateUser = () => {
    const data = {
      first_name,
      last_name,
      middle_name,
      birthday,
      phone,
      email,
      job_title,
      username,
      password,
    };

    const URL = "/users";
    console.log(data);
    $api
      .post(URL, data)
      .then((response) => {
        console.log(response);
        const userId = response.data.id;
        changeUserRole(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeUserRole = (userId) => {
    const rolesData = { roles: selectedRoles };
    const URL = `/users/${userId}/change-role`;

    $api
      .patch(URL, rolesData)
      .then((response) => {
        console.log("Roles updated:", response);
        toast.success(`Новий юзер успішно створений`, {
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

  const [selectedRoles, setSelectedRoles] = useState([]);

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
    <div className="modal-create-user">
      <div className="modal-content-create-user">
        <div
          className="btn-close-modal"
          onClick={() => {
            onClose();
          }}
        >
          <img src="/images/cross.svg" alt="Х" className="logo-autorization" />
        </div>
        <p className="modal-create-user-title">Створити користувача</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreateUser();
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
                placeholder="По-батькові"
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
            <div className="modal-content-group password">
              <input
                type="text"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            Створити
          </button>
        </form>
      </div>
    </div>
  );
};
