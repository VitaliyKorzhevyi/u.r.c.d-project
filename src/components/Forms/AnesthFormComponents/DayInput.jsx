//Todo валідація збереження від 2

import { useState } from "react";
// import axios from "../../../api/axios"; // Путь к axios
import $api from "../../../api/api";
import "./DayInput.css";

export const DayInput = ({
  formIndex,
  value,
  locked,
  forms,
  setForms,
  days,
  updateDays,
  onDayId,
}) => {
  const [filteredDays, setFilteredDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    handleInputChange(inputValue);

    if (inputValue.length >= 3) {
      setFilteredDays(
        days.filter((day) =>
          day.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredDays([]);
    }
  };

  const handleSelectDay = (selectedDay) => {
    setInputValue(selectedDay.title);
    setFilteredDays([]);
    
    handleInputChange(selectedDay.title, selectedDay.id); // передайте id
};

const handleInputChange = (inputValue, dayId) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].day = inputValue;
    if (dayId) {
      updatedForms[formIndex].preoperative_day_id = dayId;
    }
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
};

  const onDayInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }
    const isValueExists = days.some(
      (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
    );

    if (!isValueExists && !showModal) {
      setInputValue(""); // очистка поля ввода только если модальное окно не активировано
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const isValueExists = days.some(
        (day) => day.title.toLowerCase() === value.toLowerCase()
      );
      if (!isValueExists) {
        setShowModal(true);
      }
    }
  };
  
// добавляем новый день
  const handleAddNewDay = async () => {
    console.log(inputValue);
    try {
      const response = await $api.post("/preoperative-days", inputValue);
      updateDays(response.data);
      onDayId(response.data.id)
      setShowModal(false);
    } catch (error) {
      console.error("Error during saving new day", error);
    }
  };

  return (
    <>
      <input
        type="text"
        autoComplete="off"
        name="day"
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onDayInputBlur(e.target.value)}
        onKeyDown={handleInputKeyDown}
        disabled={locked}
      />
      <ul
        className="days-dropdown"
        style={{ display: filteredDays.length === 0 ? "none" : "block" }}
      >
        {filteredDays.map((day, index) => (
          <li key={index} onClick={() => handleSelectDay(day)}>
            {day.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Добавить новый день {inputValue}?</p>
          <button onClick={handleAddNewDay}>Да</button>
          <button
            onClick={() => {
              setShowModal(false);
              setInputValue("");
            }}
          >
            Отменить
          </button>
        </div>
      )}
    </>
  );
};
