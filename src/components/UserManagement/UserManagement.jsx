import { useState, useEffect } from "react";
import $api from "../../api/api";

import UserBanCheckbox from "./UserBanCheckbox";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";

import "./UserManagement.css";

const UserDetails = ({ user }) => {
  const ROLES_TRANSLATIONS = {
    head_doctor: "Головний лікар",
    accounting: "Бухгалтерія",
    pharmacy: "Аптека",
    anesthesiology: "Анестезіологія",
    surgery: "Хірургія",
    operating: "Операційна",
    resuscitation: "Реанімація",
  };

  const translateRoles = (roles) => {
    return roles.map((role) => ROLES_TRANSLATIONS[role] || role).join(", ");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  return (
    <table className="user-details-table">
      <tbody className="user-details-tbody">
        <tr>
          <td>
            <strong>Логін:</strong> {user.username}
          </td>
          <td>
            <strong>Заблокований аккаунт:</strong>{" "}
            {user.is_active ? "Ні" : "Так"}
          </td>
          <td>
            <strong>Вік:</strong> {user.age}
          </td>
          <td>
            <strong>Birthday:</strong> {user.birthday}
          </td>
          <td>
            <strong>Email:</strong> {user.email}
          </td>
        </tr>
        <tr>
          <td colSpan="2" className="user-details-size">
            {" "}
            <strong>Роль за замовчуванням:</strong> {user.default_role}
          </td>
          <td colSpan="3">
            <strong>Додаткові ролі:</strong>{" "}
            {translateRoles(user.advanced_roles)}
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <strong>Дата створення:</strong> {formatDate(user.created_at)}
          </td>
          <td colSpan="3">
            <strong>Дата оновлення:</strong>{" "}
            {user.updated_at ? formatDate(user.updated_at) : "не оновлювався"}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const User = ({ user, afterCreate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);
  const [isUserBanned, setIsUserBanned] = useState(!user.is_active);

  return (
    <div
      className={`user-info-container ${
        isUserBanned ? "checkbox-clicked" : ""
      }`}
    >
      <table>
        <tbody className="user-info-table">
          <tr>
            <td className="user-info-table-size1">
              <p>{user.full_name}</p>
            </td>
            <td className="user-info-table-size2">
              <p>{user.job_title}</p>
            </td>
            <td className="user-info-table-size3">
              <p>{user.phone}</p>
            </td>
            <td className="user-info-table-size4">
              <UserBanCheckbox
                user_id={user.id}
                is_active={!user.is_active}
                onClick={(banned) => setIsUserBanned(banned)}
              />
            </td>
            <td className="user-info-table-size5">
              <button
                type="button"
                className="btn-user-edit"
                onClick={() => setModalOpenEdit(true)}
              >
                {" "}
                Змінити данні
              </button>
            </td>
            <td
              className="user-info-table-size6"
              onClick={() => setShowDetails(!showDetails)}
            >
              <i
                className={`bx bx-chevron-down bx-md ${
                  showDetails ? "rotated-full-info-user" : ""
                }`}
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
      {showDetails && <UserDetails user={user} />}
      <EditUserModal
        isOpen={isModalOpenEdit}
        onClose={() => setModalOpenEdit(false)}
        afterCreate={afterCreate}
        userData={user}
      />
    </div>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await $api.get("/users?page=1&limit=20");
      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-container">
      <h2 className="title-users">Дані користувачів</h2>
      {/* <div
        className="container-btn-create-new-users"
      >

      </div> */}
      <div className="container-btn-create-new-users">
        <button
          type="button"
          className="create-new-user"
          onClick={() => setModalOpenCreate(true)}
        >
          Додати користувача
        </button>
      </div>
      <div className="users-list">
        {users.map((user, index) => (
          <User key={index} user={user} afterCreate={fetchData} />
        ))}
      </div>

      <CreateUserModal
        isOpen={isModalOpenCreate}
        onClose={() => setModalOpenCreate(false)}
        afterCreate={fetchData}
      />
    </div>
  );
};
