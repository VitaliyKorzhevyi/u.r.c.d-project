import { useState } from "react";
import axios from "../../../api/axios"; // Путь к axios

import "./OperationsInput.css";

export const OperationsInput = ({
  formIndex,
  value,
  locked,
  forms,
  setForms,
  operations,
  updateOperations,
}) => {
  const [filteredOperations, setFilteredOperations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onInputChange = (e) => {
    let inputValue = e.target.value;
    inputValue = capitalizeFirstLetter(inputValue);
    setInputValue(inputValue);
    handleInputChange(inputValue);

    if (inputValue.length >= 3) {
      setFilteredOperations(
        operations.filter((operations) =>
          operations.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredOperations([]);
    }
  };

  const handleInputChange = (inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].operations = inputValue;
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  const handleSelectOperations = (title) => {
    setInputValue(title);
    setFilteredOperations([]);

    const existsInOperations = operations.some(
      (operations) => operations.title.toLowerCase() === title.toLowerCase()
    );

    if (!existsInOperations) {
      updateOperations([...operations, { title }]);
      setShowModal(true);
      setInputValue("");
    }
  };
  const onOperationsInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }
    const isValueExists = operations.some(
      (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
    );

    if (!isValueExists && !showModal) {
      setInputValue(""); // очистка поля ввода только если модальное окно не активировано
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const isValueExists = operations.some(
        (operations) => operations.title.toLowerCase() === value.toLowerCase()
      );
      if (!isValueExists) {
        setShowModal(true);
      }
    }
  };

  const handleAddNewOperations = async () => {
    console.log(inputValue);
    try {
      const response = await axios.post("/operations", inputValue, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      // обновляем список
      updateOperations(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error during saving new operations", error);
    }
  };

  return (
    <>
      <input
        type="text"
        name="operations"
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onOperationsInputBlur(e.target.value)}
        onKeyDown={handleInputKeyDown}
        disabled={locked}
      />
      <ul
        className="operations-dropdown"
        style={{ display: filteredOperations.length === 0 ? "none" : "block" }}
      >
        {filteredOperations.map((operations, index) => (
          <li
            key={index}
            onClick={() => handleSelectOperations(operations.title)}
          >
            {operations.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Додати нову опервцію {inputValue}?</p>
          <button onClick={handleAddNewOperations}>Да</button>
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
