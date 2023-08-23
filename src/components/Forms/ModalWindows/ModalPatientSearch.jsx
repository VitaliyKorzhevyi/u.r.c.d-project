import { useState } from "react";
import axios from "../../../api/axios";

import { updateTokens } from "../../../updateTokens";

import "./ModalPatientSearch.css";

export const ModalPatientSearch = ({
  isOpen,
  onClose,
  onGetAge,
  onGetFullName,
  onGetBirthday,
}) => {
  const [patients, setPatients] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  if (!isOpen) return null;

  const fetchData = async (params) => {
    const access_token = localStorage.getItem("access_token");

    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const queryString = Object.entries(params)
      .filter(([_, value]) => value.length > 3) // Фильтруем параметры с длиной менее 4
      .map(([key, value]) => `${key}=${value}`) // Преобразуем в строки "ключ=значение"
      .join("&");
    if (queryString) {
      try {
        const response = await instance.get(
          `/patients?skip=0&limit=8&${queryString}`
        );
        setPatients(response.data);
        console.log(response.data);
      } catch (error) {
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.detail === "Could not validate credentials"
        ) {
          try {
            // обновление токенов
            updateTokens();
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(error);
        }
      }
    }
  };

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
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handlePhoneChange = (e) => {
    let phoneNumber = e.target.value.replace(/\+/g, ""); // Удаляем все знаки "+"
    // Убедитесь, что введенные данные состоят только из цифр
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (phoneNumber.length > 15) {
      phoneNumber = phoneNumber.slice(3, 15); // Ограничиваем длину до 10 символов
    }
    setPhone(phoneNumber);
  };

  const handleItemClick = (patient) => {
    onGetFullName(patient.full_name);
    onGetAge(patient.age);
    onGetBirthday(patient.birthday);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={onSearchPatient}>
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
            <input type="text" value={phone} onChange={handlePhoneChange} />
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
        <button type="button" onClick={onClose}>
          закрити
        </button>
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-item"
              onClick={() => handleItemClick(patient)}
            >
              <p>
                <strong>Name:</strong> {patient.full_name}
              </p>
              <p>
                <strong>Birthday:</strong> {patient.birthday}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};






