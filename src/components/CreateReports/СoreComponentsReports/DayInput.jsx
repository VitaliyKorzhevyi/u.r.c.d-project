import { useState } from "react";
import { toast } from "react-toastify";

import $api from "../../../api/api";
import "./DayInput.css";

export const DayInput = ({
  days,
  updateDays,
  formIndex,
  value,
  locked,
  forms,
  setForms,
  localStorageKey,
  onDayId,
}) => {
  const [filteredDays, setFilteredDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  //* ВВЕДЕННЯ ЗНАЧЕННЯ В ІНПУТ
  const onInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    if (inputValue.length >= 1) {
      const regex = new RegExp(inputValue.split("").join(".*"), "i");
      setFilteredDays(days.filter((day) => regex.test(day.title)));
    } else {
      setFilteredDays([]);
    }
  };

  //* ВИБІР ЗНАЧЕННЯ З ВИПАДАЮЧОГО СПИСКУ
  const onSelectDay = (selectedDay) => {
    setInputValue(selectedDay.title);
    setFilteredDays([]);
    saveValueLocalStorage(selectedDay.title, selectedDay.id, true);
  };

  //* ПЕРЕДАЧА АРГУМЕНТІВ ДЛЯ ЗБЕРІГАННЯ У ЛОКАЛЬНЕ СХОВИЩЕ
  const saveValueLocalStorage = (
    inputValue,
    dayId,
    saveToLocalStorage = true
  ) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].day = inputValue;
    if (dayId) {
      updatedForms[formIndex].preoperative_day_id = dayId;
    }
    if (saveToLocalStorage) {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedForms));
    }
    setForms(updatedForms);
  };

  //* Перевіряє наявність заданого значення у списку днів за назвою.
  const isValueInDays = (value) =>
    days.some((day) => day.title.toLowerCase() === value.toLowerCase());

  //* АКТИВНІСТЬ ІНПУТА
  const onDayInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }

    if (!isValueInDays(value) && !showModal) {
      saveValueLocalStorage("", null, false);
      setInputValue("");
      setFilteredDays([]);
    }
  };

  //* ПРИ НАТИСКАННІ НА КНОПКУ ENTER
  const onInputKeyDown = (e) => {
    const inputValueLength = e.target.value.length;

    const errorMessages = {
      [inputValueLength < 1]: "Рядок повинен містити не менше 2 символів",
      [inputValueLength > 100]: "Рядок повинен містити не більше 100 символів",
    };

    if (e.key === "Enter") {
      const errorMessage = errorMessages[true];

      if (errorMessage) {
        toast.error(errorMessage);
      } else if (!isValueInDays(e.target.value)) {
        setShowModal(true);
      }
    }
  };

  //* ПОМИЛКИ
  function onAxiosError(error) {
    const errorMessages = {
      "String should have at least 2 characters":
        "Рядок повинен містити не менше 2 символів",
      "String should have at most 100 characters":
        "Рядок повинен містити не більше 100 сим", //!зміни
    };

    if (error.response) {
      const detail = error.response.data.detail;

      if (detail[0].msg && errorMessages[detail[0].msg]) {
        toast.error(errorMessages[detail[0].msg]);
      } else {
        toast.error(
          detail[0].msg ? detail[0].msg : "Сталася невідома помилка сервера."
        );
      }
    } else if (error.request) {
      toast.error("Сервер не відповідає. Перевірте ваше підключення.");
    } else {
      toast.error(`Помилка: ${error.message}`);
    }
  }

  //* ДОДАЄМО НОВИЙ ДЕНЬ НА БЕК
  const onAddNewDay = async () => {
    try {
      const response = await $api.post("/preoperative-days", inputValue);
      toast.success(`Нова к-сть. діб успішно додана`);
      updateDays(response.data);
      onDayId(response.data.id);
      setShowModal(false);
      saveValueLocalStorage(inputValue, response.data.id, true);
    } catch (error) {
      onAxiosError(error);
      setShowModal(false);
      setInputValue("");
      setFilteredDays([]);
    }
  };

  return (
    <>
      <input
        type="text"
        autoComplete="off"
        name="day"
        maxLength={100}
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onDayInputBlur(e.target.value)}
        onKeyDown={onInputKeyDown}
        disabled={locked}
      />
      <ul
        className="days-dropdown"
        style={{ display: filteredDays.length === 0 ? "none" : "block" }}
      >
        {filteredDays.map((day, index) => (
          <li key={index} onMouseDown={() => onSelectDay(day)}>
            {day.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Додати "{inputValue}"?</p>
          <div className="confirm-modal-btn-save">
          <button
              onClick={() => {
                setShowModal(false);
                setInputValue("");
                setFilteredDays([]);
              }}
            >
              Ні
            </button>
            <button onClick={onAddNewDay}>Так</button>
          </div>
        </div>
      )}
    </>
  );
};
