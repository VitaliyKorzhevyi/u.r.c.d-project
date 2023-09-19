import { useState } from "react";
import { toast } from "react-toastify";

import $api from "../../../api/api";
import "./MedicamentInput.css";

export const MedicamentInput = ({
  medicaments,
  updateMedicaments,
  formIndex,
  rowIndex,
  value,
  locked,
  forms,
  setForms,
  localStorageKey,
  onMedicamentId,
}) => {
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
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
      setFilteredMedicaments(
        medicaments.filter((medicaments) =>
          medicaments.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredMedicaments([]);
    }
  };

  //* ВИБІР ЗНАЧЕННЯ З ВИПАДАЮЧОГО СПИСКУ
  const onSelectMedicament = (selectedMedicament) => {
    setInputValue(selectedMedicament.title);
    setFilteredMedicaments([]);
    saveValueLocalStorage(selectedMedicament.title, selectedMedicament.id, true);
  };

  //* ПЕРЕДАЧА АРГУМЕНТІВ ДЛЯ ЗБЕРІГАННЯ У ЛОКАЛЬНЕ СХОВИЩЕ
  const saveValueLocalStorage = (
    inputValue,
    onMedicamentId,
    saveToLocalStorage = true
  ) => {
    const updatedForms = [...forms];
    console.log(updatedForms);
    updatedForms[formIndex].rows[rowIndex].medicaments = inputValue;

    if (onMedicamentId) {
      updatedForms[formIndex].rows[rowIndex].medicament_id = onMedicamentId;
    }
    if (saveToLocalStorage) {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedForms));
    }

    setForms(updatedForms);
  };

  //* Перевіряє наявність заданого значення у списку днів за назвою.
  const isValueInMedicaments = (value) =>
    medicaments.some(
      (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
    );

  //* АКТИВНІСТЬ ІНПУТА
  const onMedicamentsInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }

    if (!isValueInMedicaments(value) && !showModal) {
      saveValueLocalStorage("", null, false);
      setInputValue("");
      setFilteredMedicaments([]);
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
      } else if (!isValueInMedicaments(e.target.value)) {
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

  //* ДОДАЄМО НОВИЙ МЕДИКАМЕНТ
  const onAddNewMedicament = async () => {
    console.log(inputValue);
    try {
      const response = await $api.post("/medicaments", inputValue);
      toast.success(`Медикамент успішно доданий`);
      updateMedicaments(response.data);
      onMedicamentId(response.data.id);
      setShowModal(false);
      saveValueLocalStorage(inputValue, response.data.id, true)
    } catch (error) {
      onAxiosError(error);
      setShowModal(false);
      setInputValue("");
      setFilteredMedicaments([]);
    }
  };

  return (
    <>
      <input
        type="text"
        autoComplete="off"
        name="medicaments"
        className="form1-table-text-name"
        value={inputValue}
        onChange={onInputChange}
        onBlur={(e) => onMedicamentsInputBlur(e.target.value)}
        onKeyDown={onInputKeyDown}
        disabled={locked}
      />
      <ul
        className="days-dropdown"
        style={{ display: filteredMedicaments.length === 0 ? "none" : "block" }}
      >
        {filteredMedicaments.map((med) => (
          <li key={med.id} onMouseDown={() => onSelectMedicament(med)}>
            {med.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Додати новий медикамент {inputValue}?</p>
          <button onClick={onAddNewMedicament}>Так</button>
          <button
            onClick={() => {
              setShowModal(false);
              setInputValue("");
              setFilteredMedicaments([]);
            }}
          >
            Відмінити
          </button>
        </div>
      )}
    </>
  );
};
