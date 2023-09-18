import { useState } from "react";
import { toast } from "react-toastify";

import $api from "../../../api/api";
import "./OperationsInput.css";

export const OperationsInput = ({
  operations,
  updateOperations,
  formIndex,
  value,
  locked,
  forms,
  setForms,
  localStorageKey,
  onOperationId,
}) => {
  const [filteredOperations, setFilteredOperations] = useState([]);
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
      setFilteredOperations(
        operations.filter((operations) =>
          operations.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredOperations([]);
    }
  };

  //* ВИБІР ЗНАЧЕННЯ З ВИПАДАЮЧОГО СПИСКУ
  const onSelectOperations = (selectedOperatios) => {
    setInputValue(selectedOperatios.title);
    setFilteredOperations([]);
    saveValueLocalStorage(selectedOperatios.title, selectedOperatios.id, true);
  };

  //* ПЕРЕДАЧА АРГУМЕНТІВ ДЛЯ ЗБЕРІГАННЯ У ЛОКАЛЬНЕ СХОВИЩЕ
  const saveValueLocalStorage = (
    inputValue,
    onOperationId,
    saveToLocalStorage = true
  ) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].operations = inputValue;
    if (onOperationId) {
      updatedForms[formIndex].operation_id = onOperationId;
    }
    if (saveToLocalStorage) {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedForms));
    }

    setForms(updatedForms);
  };

  //* Перевіряє наявність заданого значення у списку днів за назвою.
  const isValueInOperations = (value) =>
    operations.some(
      (operations) => operations.title.toLowerCase() === value.toLowerCase()
    );

  //* АКТИВНІСТЬ ІНПУТА
  const onOperationsInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }

    if (!isValueInOperations(value) && !showModal) {
      saveValueLocalStorage("", null, false);
      setInputValue("");
      setFilteredOperations([]);
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
      } else if (!isValueInOperations(e.target.value)) {
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

  //* ДОДАЄМО НОВУ ОПЕРАЦІЮ НА БЕК
  const onAddNewOperations = async () => {
    console.log(inputValue);
    try {
      const response = await $api.post("/operations", inputValue);
      toast.success(`Операція успішно додана`);
      updateOperations(response.data);
      onOperationId(response.data.id);
      setShowModal(false);
    } catch (error) {
      onAxiosError(error);
      setShowModal(false);
      setInputValue("");
      setFilteredOperations([]);
    }
  };

  return (
    <>
      <input
        type="text"
        autoComplete="off"
        name="operations"
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onOperationsInputBlur(e.target.value)}
        onKeyDown={onInputKeyDown}
        disabled={locked}
      />
      <ul
        className="operations-dropdown"
        style={{ display: filteredOperations.length === 0 ? "none" : "block" }}
      >
        {filteredOperations.map((operations, index) => (
          <li
            key={index}
            onMouseDown={() => onSelectOperations(operations)}
          >
            {operations.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Додати нову операцію {inputValue}?</p>
          <button onClick={onAddNewOperations}>Так</button>
          <button
            onClick={() => {
              setShowModal(false);
              setInputValue("");
              setFilteredOperations([]);
            }}
          >
            Відмінити
          </button>
        </div>
      )}
    </>
  );
};
