import { useState } from "react";
import { toast } from "react-toastify";

import $api from "../../../api/api";
import "./DiagnosesInput.css";

export const DiagnosesInput = ({
  diagnoses,
  updateDiagnoses,
  formIndex,
  value,
  locked,
  forms,
  setForms,
  localStorageKey,
  onDiagnosesId,
}) => {
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  //* ПЕРША ВЕЛИКА БУКВА
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //* ВВЕДЕННЯ ЗНАЧЕННЯ В ІНПУТ
  const onInputChange = (e) => {
    let inputValue = e.target.value;
    inputValue = capitalizeFirstLetter(inputValue);
    setInputValue(inputValue);

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

  //* ВИБІР ЗНАЧЕННЯ З ВИПАДАЮЧОГО СПИСКУ
  const onSelectDiagnoses = (selectedDiagnoses) => {
    setInputValue(selectedDiagnoses.title);
    setFilteredDiagnoses([]);
    saveValueLocalStorage(selectedDiagnoses.title, selectedDiagnoses.id, true);
  };

  //* ПЕРЕДАЧА АРГУМЕНТІВ ДЛЯ ЗБЕРІГАННЯ У ЛОКАЛЬНЕ СХОВИЩЕ
  const saveValueLocalStorage = (
    inputValue,
    onDiagnosesId,
    saveToLocalStorage = true
  ) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].diagnoses = inputValue;
    if (onDiagnosesId) {
      updatedForms[formIndex].diagnosis_id = onDiagnosesId;
    }
    if (saveToLocalStorage) {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedForms));
    }

    setForms(updatedForms);
  };

  //* Перевіряє наявність заданого значення у списку днів за назвою.
  const isValueInDiagnoses = (value) =>
    diagnoses.some(
      (diagnos) => diagnos.title.toLowerCase() === value.toLowerCase()
    );

  //* АКТИВНІСТЬ ІНПУТА
  const onDiagnosesInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }

    if (!isValueInDiagnoses(value) && !showModal) {
      saveValueLocalStorage("", null, false);
      setInputValue("");
      setFilteredDiagnoses([]);
    }
  };

  //* ПРИ НАТИСКАННІ НА КНОПКУ ENTER
  
  const onInputKeyDown = (e) => {
    const inputValueLength = e.target.value.length;
  
    const errorMessages = {
      [inputValueLength < 3]: "Рядок повинен містити не менше 3 символів",
      [inputValueLength > 100]: "Рядок повинен містити не більше 100 символів"
    };
  
    if (e.key === "Enter") {
      const errorMessage = errorMessages[true];
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else if (!isValueInDiagnoses(e.target.value)) {
        setShowModal(true);
      }
    }
  };

    //* ПОМИЛКИ
    function onAxiosError(error) {
      const errorMessages = {
        "String should have at least 3 characters":
          "Рядок повинен містити не менше 3 символів",
        "String should have at most 100 characters":
          "Рядок повинен містити не більше 100 символів",
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

  //* ДОДАЄМО НОВИЙ ДІАГНОЗ НА БЕК
  const onAddNewDiagnoses = async () => {
    console.log(inputValue);
    try {
      const response = await $api.post("/diagnoses", inputValue);
      toast.success(`Діагноз успішно доданий`);
      updateDiagnoses(response.data);
      onDiagnosesId(response.data.id);
      setShowModal(false);
    } catch (error) {
      onAxiosError(error);
      setShowModal(false);
      setInputValue("");
      setFilteredDiagnoses([]);
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
        onKeyDown={onInputKeyDown}
        disabled={locked}
      />
      <ul
        className="diagnoses-dropdown"
        style={{ display: filteredDiagnoses.length === 0 ? "none" : "block" }}
      >
        {filteredDiagnoses.map((diagnoses, index) => (
          <li key={index} onMouseDown={() => onSelectDiagnoses(diagnoses)}>
            {diagnoses.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Додати новий діагноз {inputValue}?</p>
          <button onClick={onAddNewDiagnoses}>Так</button>
          <button
            onClick={() => {
              setShowModal(false);
              setInputValue("");
              setFilteredDiagnoses([]);
            }}
          >
            Відмінити
          </button>
        </div>
      )}
    </>
  );
};
