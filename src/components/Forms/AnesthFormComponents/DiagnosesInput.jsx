import { useState } from "react";
import $api from "../../../api/api";

import "./DiagnosesInput.css";

export const DiagnosesInput = ({
  formIndex,
  value,
  locked,
  forms,
  setForms,
  diagnoses,
  updateDiagnoses,
  onDiagnosesId,
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

  const handleSelectDiagnoses = (selectedDiagnoses) => {
    setInputValue(selectedDiagnoses.title);
    setFilteredDiagnoses([]);

    const existsInDiagnoses = diagnoses.some(
      (diagnosis) => diagnosis.title.toLowerCase() === selectedDiagnoses.title.toLowerCase()
    );

    if (!existsInDiagnoses) {
      updateDiagnoses([...diagnoses, selectedDiagnoses]);
      setShowModal(true);
      setInputValue("");
    }

    // Обновите forms со значением diagnosis и diagnosis_id
    const updatedForms = [...forms];
    updatedForms[formIndex].diagnoses = selectedDiagnoses.title;
    updatedForms[formIndex].diagnosis_id = selectedDiagnoses.id;
    setForms(updatedForms);
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));

    onDiagnosesId(selectedDiagnoses.id)
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
      const response = await $api.post("/diagnoses", inputValue);

      // обновляем список
      updateDiagnoses(response.data);
      onDiagnosesId(response.data.id)
      setShowModal(false);
    } catch (error) {
      console.error("Error during saving new diagnoses", error);
    }
  };

  return (
    <>
      <input
        type="text"
        autoComplete="off"
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
            onClick={() => handleSelectDiagnoses(diagnoses)}
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
