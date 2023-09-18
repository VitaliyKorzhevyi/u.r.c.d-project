//todo перевірити пошук за номером
import { useState } from "react";
import { toast } from "react-toastify";
import $api from "../../../api/api";

import "./ModalPatientSearch.css";

export const ModalPatientSearch = ({
  isOpen,
  onClose,
  onGetAge,
  onGetFullName,
  onGetBirthday,
  onGetId,
}) => {
  const [patients, setPatients] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  // Очищення полів
  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthday("");
    setPhone("");
    setEmail("");
    setPatients([]);
  };

  // Якщо модальне вікно не відкрите, нічого не рендерити
  if (!isOpen) return null;

  const MIN_LENGTH = 4;
  const DEFAULT_LIMIT = 8;
  const DEFAULT_SKIP = 0;

  // Перевірки даних перед відправкою запиту
  const validateParams = (params) => {
    for (let value of Object.values(params)) {
      if (value && value.length < MIN_LENGTH) {
        toast.warn(`Рядок повинен містити не менше ${MIN_LENGTH} символів!`);
        return false;
      }
    }
    return true;
  };

  // Створення рядка параметрів для URL
  const createQueryString = (params) => {
    return Object.entries(params)
      .filter(([_, value]) => value && value.length >= MIN_LENGTH)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  };

  // Отримання даних про пацієнтів
  const fetchData = async (params) => {
    if (!validateParams(params)) return;

    const queryString = createQueryString(params);
    console.log("Sending request with params:", queryString);

    if (!queryString) return;

    try {
      const response = await $api.get(
        `/patients?skip=${DEFAULT_SKIP}&limit=${DEFAULT_LIMIT}&${queryString}`
      );
      if (!response.data.length) {
        toast.warn("Пацієнт не знайдений.");
      } else {
        setPatients(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Пошук не вдався", error);
      toast.error("Помилка під час пошуку. Будь ласка, спробуйте пізніше.");
    }
  };

  // Обробник події натиснення кнопки "Пошук", предача данних на бек
  const onSearchPatient = (e) => {
    e.preventDefault();
    fetchData({
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName,
      phone: phone,
      email: email,
      birthday: birthday,
    });
  };

  // Першої велика літера
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Валідація для телефону
  const onPhoneChange = (e) => {
    let phoneNumber = e.target.value.replace(/\+/g, "");

    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (phoneNumber.length > 15) {
      phoneNumber = phoneNumber.slice(3, 15);
    }
    setPhone(phoneNumber);
  };

  // Вибір пацієнта зі списку
  const onItemClick = (patient) => {
    console.log("Selected patient:", patient);
    onGetFullName(patient.full_name);
    onGetAge(patient.age);
    onGetBirthday(patient.birthday);
    onGetId(patient.id);

    // Очистити всі поля
    resetFields();

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={onSearchPatient} className="seacrh-container">
          <label>
            Призвіще:
            <input
              value={lastName}
              onChange={(e) => setLastName(capitalize(e.target.value))}
            />
          </label>
          <label>
            Ім'я:
            <input
              value={firstName}
              onChange={(e) => setFirstName(capitalize(e.target.value))}
            />
          </label>
          <label>
            По-батькові:
            <input
              value={middleName}
              onChange={(e) => setMiddleName(capitalize(e.target.value))}
            />
          </label>
          <label>
            тел:
            <input type="text" value={phone} onChange={onPhoneChange} />
          </label>
          <label>
            Дата народження:
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </label>
          <label>
            Пошта:
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit">Пошук</button>
        </form>
        <button
          type="button"
          onClick={() => {
            resetFields();

            onClose();
          }}
        >
          закрити
        </button>
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-item"
              onClick={() => onItemClick(patient)}
            >
              <ul className="patient-list-info">
                <li>
                  <p>
                    <strong>Name:</strong> {patient.full_name}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Birthday:</strong> {patient.birthday}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Age:</strong> {patient.age}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Phone:</strong> {patient.phone}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Email:</strong> {patient.email}
                  </p>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
