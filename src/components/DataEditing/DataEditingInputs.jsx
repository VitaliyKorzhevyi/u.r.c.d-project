import { useState } from "react";

export const DataEditingInputs = ({
  items,
  selectedItem,
  onItemSelect,
}) => {
  const [inputValue, setInputValue] = useState(selectedItem || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const MIN_INPUT_LENGTH = 1;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
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
