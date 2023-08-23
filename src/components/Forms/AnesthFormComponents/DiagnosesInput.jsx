import { useState } from "react";
import axios from "../../../api/axios"; // Путь к axios

import "./DiagnosesInput.css";

export const DiagnosesInput = ({
  formIndex,
  value,
  locked,
  forms,
  setForms,
  diagnoses,
  updateDiagnoses,
}) => {
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onDiagnosesInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }
    const isValueExists = diagnoses.some(
      (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
    );

    if (!isValueExists && !showModal) {
      setInputValue(""); // очистка поля ввода только если модальное окно не активировано
    }
  };

  const onInputChange = (e) => {
    let inputValue = e.target.value;
    inputValue = capitalizeFirstLetter(inputValue);
    setInputValue(inputValue);
    handleInputChange(inputValue);

    if (inputValue.length >= 3) {
      setFilteredDiagnoses(
        diagnoses.filter((diagnoses) =>
          diagnoses.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredDiagnoses([]);
    }
  };

  const handleInputChange = (inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].diagnoses = inputValue;
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  const handleSelectDiagnoses = (title) => {
    setInputValue(title);
    setFilteredDiagnoses([]);

    const existsInDiagnoses = diagnoses.some(
      (diagnoses) => diagnoses.title.toLowerCase() === title.toLowerCase()
    );

    if (!existsInDiagnoses) {
      updateDiagnoses([...diagnoses, { title }]);
      setShowModal(true);
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const isValueExists = diagnoses.some(
        (diagnoses) => diagnoses.title.toLowerCase() === value.toLowerCase()
      );
      if (!isValueExists) {
        setShowModal(true);
      }
    }
  };

  const handleAddNewDiagnoses = async () => {
    console.log(inputValue);
    try {
      const response = await axios.post("/diagnoses", inputValue, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      // обновляем список
      updateDiagnoses(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error during saving new diagnoses", error);
    }
  };

  return (
    <>
      <input
        type="text"
        name="diagnoses"
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onDiagnosesInputBlur(e.target.value)}
        onKeyDown={handleInputKeyDown}
        disabled={locked}
      />
      <ul
        className="diagnoses-dropdown"
        style={{ display: filteredDiagnoses.length === 0 ? "none" : "block" }}
      >
        {filteredDiagnoses.map((diagnoses, index) => (
          <li
            key={index}
            onClick={() => handleSelectDiagnoses(diagnoses.title)}
          >
            {diagnoses.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Добавить новый диагноз {inputValue}?</p>
          <button onClick={handleAddNewDiagnoses}>Да</button>
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
