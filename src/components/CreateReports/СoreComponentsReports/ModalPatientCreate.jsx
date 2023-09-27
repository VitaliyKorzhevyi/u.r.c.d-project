//Todo додати зірочки

import { useState } from "react";
import { toast } from "react-toastify";
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

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthday("");
    setPhone("");
    setEmail("");
  };
  if (!isOpen) return null;

  //* ПЕРЕВІРКА ДЛЯ ІНПУТІВ
  const MAIN_FIELDS = {
    first_name: '"Ім\'я"',
    last_name: '"Призвіще"',
    middle_name: '"По-батькові"',
    birthday: '"Дата народження"',
  };
  const getMissingFieldsMessage = (fields) => {
    const stateValues = { first_name, last_name, middle_name, birthday };

    const missingFields = Object.keys(fields)
      .filter(
        (field) => !stateValues[field] || !stateValues[field].toString().trim()
      )
      .map((field) => fields[field])
      .join(", ");

    if (!missingFields) return "";

    return `${
      missingFields.split(", ").length > 1
        ? "Не заповнені поля"
        : "Не заповнене поле"
    }: ${missingFields}!`;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+\d{7,15}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    return email.includes("@");
  };

  const validateInputs = (e) => {
    const missingMainFieldsMessage = getMissingFieldsMessage(MAIN_FIELDS);

    if (missingMainFieldsMessage) {
      toast.warn(missingMainFieldsMessage, {
        autoClose: 2500,
      });
      e.preventDefault();
      return;
    }

    if (phone && !validatePhone(phone)) {
      toast.warn(
        "Невірний формат телефону! Він повинен виглядати як +123456789012",
        {
          autoClose: 2500,
        }
      );
      e.preventDefault();
      return;
    }

    if (email && !validateEmail(email)) {
      toast.warn("Помилка у форматі пошти! Вона повинна містити символ '@'", {
        autoClose: 2500,
      });
      e.preventDefault();
      return;
    }

    onCreatePatient(e);
  };

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
      resetFields();

      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.info("Пацієнт із таким номером телефону вже існує!", {
          autoClose: 2500,
        });
      } else {
        toast.error("Помилка: Не можливо створити пацієнта!");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          className="btn-close-modal"
          onClick={() => {
            resetFields();
            onClose();
          }}
        >
          <img src="/images/cross.svg" alt="Х" className="logo-autorization" />
        </div>
        <p className="modal-search-title">Додати пацієнта у реєстр</p>

        <form onSubmit={validateInputs} className="modal-container">
          <div className="input-container">
            <label>
              <input
                type="text"
                placeholder="Призвіще"
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
              <input
                type="text"
                placeholder="Ім'я"
                value={first_name}
                onChange={(e) =>
                  setFirstName(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
              />
            </label>
          </div>
          <div className="input-container">
            <label>
              <input
                type="text"
                placeholder="По-батькові"
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
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label>
              <input
                type="email"
                placeholder="Пошта"
                value={email}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
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
            </label>
          </div>
          <div>
            <button type="submit" className="btn-create">
              Додати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
