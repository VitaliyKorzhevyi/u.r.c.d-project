import { useState } from "react";
import { isThreeDaysOld } from "./dateUtils";

export const MedicamentInputEditing = ({
  items,
  selectedItem,
  onItemSelect,
  createdAt,
}) => {
  const [inputValue, setInputValue] = useState(selectedItem || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const MIN_INPUT_LENGTH = 3;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const disabledInput = isThreeDaysOld(createdAt);

  return (
    <div className="autocomplete-container">
      <div>
        <input
          className="medicament-input input-size-save-table"
          type="text"
          title={inputValue}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabledInput}
        />
      </div>
      {isDropdownVisible && (
        <ul className="autocomplete-dropdown-medicament">
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
