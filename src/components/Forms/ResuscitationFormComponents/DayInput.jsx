//Todo валідація збереження від 2

import { useState } from "react";
import axios from "../../../api/axios"; // Путь к axios

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

  const handleInputChange = (inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].day = inputValue;
    localStorage.setItem("resuscitationForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  const handleSelectDay = (selectedDay) => {
    setInputValue(selectedDay.title);
    setFilteredDays([]);

    const existsInDays = days.some(
      (day) => day.title.toLowerCase() === selectedDay.title.toLowerCase()
    );

    if (!existsInDays) {
      updateDays([...days, selectedDay]);
      setShowModal(true);
      setInputValue("");
    }
    onDayId(selectedDay.id)
    console.log("Selected days id:", selectedDay.id);
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

  const handleAddNewDay = async () => {
    console.log(inputValue);
    try {
      const response = await axios.post("/preoperative-days", inputValue, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      // обновляем список
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
