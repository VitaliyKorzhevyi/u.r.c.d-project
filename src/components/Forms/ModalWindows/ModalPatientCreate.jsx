//Todo додати бібліотеку валідації країн

import { useState } from "react";
import axios from "../../../api/axios";

import { updateTokens } from "../../../updateTokens";

import "./ModalPatientCreate.css";

export const ModalPatientCreate = ({ isOpen, onClose, onGetAge, onGetFullName, onGetBirthday }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;
  const onCreatePatient = async (e) => {
    e.preventDefault();

    try {
      const access_token = localStorage.getItem("access_token");

      const instance = axios.create({
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = {
        first_name,
        last_name,
        middle_name,
        birthday,
        phone,
        email,
      };

      const response = await instance.post("/patients", data);
     
      onGetAge(response.data.age);
      onGetFullName(response.data.patientName);
      onGetBirthday(response.data.birthday);
      
  
      setTimeout(() => {
        onClose();
      }, 600);
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
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={onCreatePatient}>
          <label>
            Призвіще:
            <input
              type="text"
              value={last_name}
              onChange={(e) =>
                setLastName(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
            />
          </label>
          <label>
            Ім'я:
            <input
              type="text"
              value={first_name}
              onChange={(e) =>
                setFirstName(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
            />
          </label>
          <label>
            По-батькові:
            <input
              type="text"
              value={middle_name}
              onChange={(e) =>
                setMiddleName(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
            />
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
            Тел:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label>
            Пошта:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit">Send</button>
        </form>
        <button type="button" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );
};
