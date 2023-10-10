import { useState, useEffect } from "react";

export const UsersSorting = ({ onFormDataChange }) => {
  const [formData, setFormData] = useState({
    limit: "20",
    sort: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    birthday: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);

  return (
    <ul className="user-sorting-list">
      <li className="user-sorting-item">
        <p>
          <strong>К-сть. елементів на сторінці</strong>
        </p>

        <select
          name="limit"
          className="select-value-page"
          onChange={handleInputChange}
          value={formData.limit}
        >
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </li>
      <li className="user-sorting-item">
        <p>
          <strong>Сортувати</strong>
        </p>

        <select
          name="sort"
          className="select-value-sort"
          onChange={handleInputChange}
          value={formData.sort}
        >
          <option value="last_name">Від А до Я</option>
          <option value="-last_name">Від Я до А</option>
        </select>
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>Прізвище</strong>
        </p>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
        />
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>Ім'я</strong>
        </p>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>По батькові</strong>
        </p>
        <input
          type="text"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleInputChange}
        />
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>Дата народження</strong>
        </p>
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleInputChange}
        />
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>Телефон</strong>
        </p>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </li>
      <li className="user-sorting-item inp-sort">
        <p>
          <strong>Пошта</strong>
        </p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </li>
    </ul>
  );
};

