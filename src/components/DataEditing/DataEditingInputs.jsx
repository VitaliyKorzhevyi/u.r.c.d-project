import { useState } from "react";
import $api from "../../api/api";
import { toast } from "react-toastify";


export const DataEditingInputs = ({ items, selectedItem, onItemSelect, urlSelect, msgSuccess, updateData }) => {
  const [inputValue, setInputValue] = useState(selectedItem || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const MIN_INPUT_LENGTH = 1;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const onAddNewData = async () => {
    try {
      const response = await $api.post(urlSelect, inputValue);
      toast.success(`${msgSuccess} "${inputValue}" успішно додано`);
      updateData(response);
      console.log("Відповідь", response);
    } catch (error) {
      toast.error(`Помилка`);
    }
  };

  return (
    <div className="autocomplete-container-edit-data">
      <div>
        <label htmlFor="medicament-edit">Знайти:&nbsp;</label>
        <input
          id="medicament-edit"
          className="medicament-input-edit-data"
          type="text"
          autoComplete="off"
          title={inputValue}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="btn-editing-data-item"
          onClick={onAddNewData}
        >
          Додати
        </button>
      </div>
      {isDropdownVisible && (
        <ul className="autocomplete-dropdown-edit-data">
          {items
            .filter((item) =>
              item.title.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setInputValue(item.title);
                  setIsDropdownVisible(false);
                  onItemSelect(item.id);
                }}
              >
                {item.title}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
