import { useState } from "react";
import axios from "../../../api/axios"; // Путь к axios

import "./MedicamentInput.css";

export const MedicamentInput = ({
  formIndex,
  rowIndex,
  value,
  locked,
  forms,
  setForms,
  medicaments,
  updateMedicaments,
  onMedicamentId,
}) => {
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onMedicamentsInputBlur = (value) => {
    if (value.trim() === "") {
      return;
    }
    const isValueExists = medicaments.some(
      (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
    );

    if (!isValueExists && !showModal) {
      setInputValue(""); // очистка поля ввода только если модальное окно не активировано
    }
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    inputValue = capitalizeFirstLetter(inputValue);
    setInputValue(inputValue);
   
    onInputChange(formIndex, rowIndex, "medicaments", inputValue);
    if (inputValue.length >= 3) {
      setFilteredMedicaments(
        medicaments.filter((med) =>
          med.title.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredMedicaments([]);
    }
  };

  const handleAddNewMedicament = async () => {
    try {
        console.log("значення", inputValue);
        const response = await axios.post("/medicaments", inputValue, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            },
        });
        updateMedicaments(response.data);
        onMedicamentId(response.data.id); // Обновляем id текущего медикамента в родительском компоненте
        onInputChange(formIndex, rowIndex, "medicament_id", response.data.id);
        console.log("Added new medicament with id:", response.data.id);
        setShowModal(false);
    } catch (error) {
        console.error("Error during saving new day", error);
    }
};

  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem("resuscitationForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  const handleSelectMedicament = (medicament) => {
    setInputValue(medicament.title);
    setFilteredMedicaments([]);
    onInputChange(formIndex, rowIndex, "medicament_id", medicament.id); // обновляем medicament_id
    onInputChange(formIndex, rowIndex, "medicaments", medicament.title);
    const existsInMedicaments = medicaments.some(
        (med) => med.title.toLowerCase() === medicament.title.toLowerCase()
    );

    if (!existsInMedicaments) {
        updateMedicaments([...medicaments, medicament]);
        setShowModal(true);
        setInputValue("");
    }
    onMedicamentId(medicament.id);
};

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      const isValueExists = medicaments.some(
        (medicament) => medicament.title.toLowerCase() === value.toLowerCase()
      );
      if (!isValueExists) {
        setShowModal(true);
      }
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
        onChange={handleInputChange}
        onBlur={(e) => onMedicamentsInputBlur(e.target.value)}
        onKeyDown={handleInputKeyDown}
        disabled={locked}
      />
      <ul
        className="days-dropdown"
        style={{ display: filteredMedicaments.length === 0 ? "none" : "block" }}
      >
        {filteredMedicaments.map((med) => (
          <li key={med.id} onClick={() => handleSelectMedicament(med)}>
            {med.title}
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="confirm-modal">
          <p>Добавить новый медикамент {inputValue}?</p>
          <button onClick={handleAddNewMedicament}>Да</button>
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
