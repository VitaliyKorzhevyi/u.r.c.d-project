import { useState, useEffect, useCallback, useContext } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";

import ReactPaginate from "react-paginate";

import UserBanCheckbox from "./UserBanCheckbox";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { UsersSorting } from "./UsersSorting";

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

    return `${day}.${month}.${year} (${hours}:${minutes})`;
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
            <strong>Дата народження:</strong>{" "}
            {user.birthday.split("-").reverse().join(".")}
          </td>
          <td>
            <strong>Пошта:</strong> {user.email}
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
            <strong>Дата і час створення:</strong> {formatDate(user.created_at)}
          </td>
          <td colSpan="3">
            <strong>Дата і час оновлення:</strong>{" "}
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
            <td className="user-info-table-size4">
              <i className={`bx bxs-circle ${user.is_online ? "online-user" : ""}`}></i>
            </td>
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
              <div>
                <UserBanCheckbox
                  user_id={user.id}
                  is_active={!user.is_active}
                  onClick={(banned) => setIsUserBanned(banned)}
                />
              </div>
            </td>
            <td className="user-info-table-size5">
              <button
                type="button"
                className="btn-user-edit"
                onClick={() => setModalOpenEdit(true)}
              >
                Змінити данні
              </button>
            </td>
            <td
              className="user-info-table-size6"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div>
                <i
                  className={`bx bxs-chevron-down bx-sm ${
                    showDetails ? "rotated-full-info-user" : ""
                  }`}
                ></i>
              </div>
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
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);

  const [currentFormData, setCurrentFormData] = useState({});
  const { myData } = useContext(UserDataContext);
  // const userData = useContext(UserDataContext);
  const onFormDataChange = (newFormData) => {
    setCurrentFormData(newFormData);
  };

  useEffect(() => {
    const url = `/users`;
    const options = {
      params: {
        page: 1,
        limit: 20,
      },
    };

    $api
      .get(url, options)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
      });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const initialParams = {
        page: 1,
        ...currentFormData,
      };

      const params = Object.keys(initialParams)
        .filter((key) => initialParams[key])
        .reduce((obj, key) => {
          obj[key] = initialParams[key];
          return obj;
        }, {});

      const queryString = new URLSearchParams(params).toString();
      const url = `/users?${queryString}`;
      console.log(url);

      const response = await $api.get(url);
      console.log(response.data.users);
      setUsers(response.data.users);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log(error);
    }
  }, [currentFormData]);

  const paginationData = (url) => {
    $api.get(url).then((response) => {
      setUsers(response.data.users);
      setTotalPages(response.data.total_pages);
    });
  };

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    const initialParams = {
      page: page,
      ...currentFormData,
    };

    const params = Object.keys(initialParams)
      .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
      .reduce((obj, key) => {
        obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
        return obj;
      }, {});

    const queryString = new URLSearchParams(params).toString();
    const url = `/users?${queryString}`;
    paginationData(url);
  };

  return (
    <div className="users-container">
      <div className="big-container-users-management">
        <div className="users-sorting-container">
          <UsersSorting onFormDataChange={onFormDataChange} />
          <button
            type="button"
            className="users-sorting-btn"
            onClick={fetchData}
          >
            Знайти
          </button>
        </div>
        <div className="users-management-container">
          <div className="container-btn-create-new-users">
            <button
              type="button"
              className="create-new-user"
              onClick={() => setModalOpenCreate(true)}
            >
              Додати користувача
            </button>
            <div
              className="admin-settings-icons"
              onClick={() => setModalOpenEdit(true)}
            >
              <i className="bx bx-cog"></i>
            </div>
          </div>
          <div className="users-list">
            {users.map((user) => (
              <User key={user.id} user={user} afterCreate={fetchData} />
            ))}
          </div>
          <div className="pagination">
            {totalPages > 1 && (
              <ReactPaginate
                previousLabel={<i className="bx bxs-chevron-left bx-md"></i>}
                nextLabel={<i className="bx bxs-chevron-right bx-md"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => handlePageChange(selected + 1)}
                containerClassName={"pagination-edit-reports"}
                subContainerClassName={"pagination-edit-reports-sub"}
                activeClassName={"active"}
                pageClassName={"page-item"}
              />
            )}
          </div>
        </div>
      </div>
      <EditUserModal
        isOpen={isModalOpenEdit}
        onClose={() => setModalOpenEdit(false)}
        userData={myData}
      />
      <CreateUserModal
        isOpen={isModalOpenCreate}
        onClose={() => setModalOpenCreate(false)}
        afterCreate={fetchData}
      />
    </div>
  );
};
