//Todo додати валідацію

import { useState } from "react";
import $api from "../../../api/api";

import "./ModalPatientCreate.css";

export const ModalPatientCreate = ({
  isOpen,
  onClose,
  onGetAge,
  onGetFullName,
  onGetBirthday,
  onGetId,
}) => {
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
      const data = {
        first_name,
        last_name,
        middle_name,
        birthday,
        phone,
        email,
      };
      console.log(data);
      const response = await $api.post("/patients", data);

      onGetAge(response.data.age);
      onGetFullName(response.data.full_name);
      onGetBirthday(response.data.birthday);
      onGetId(response.data.id);
      console.log(response.data);

      // Очистити всі поля
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setBirthday("");
      setPhone("");
      setEmail("");

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      console.error("Добавление пользователя не удалося", error);
    }
  };

  return (
    <div className="modal-overlay-create">
      <div className="modal-content-create">
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
          <button type="submit">Створити</button>
        </form>
        <button type="button" onClick={onClose}>
          Закрити
        </button>
      </div>
    </div>
  );
};
