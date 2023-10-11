import { useState, useEffect } from "react";
import { isThreeDaysOld } from "./dateUtils";

export const DiagnosesInputEditing = ({
  items,
  selectedItem,
  onItemSelect,
  createdAt,
}) => {
  const [inputValue, setInputValue] = useState(selectedItem || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    setInputValue(selectedItem || "");
  }, [selectedItem]);

  const MIN_INPUT_LENGTH = 1;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const disabledInput = isThreeDaysOld(createdAt);

  return (
    <div className="autocomplete-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="diagnosesInput" style={{ marginRight: "10px" }}>
        <strong>Діагноз:</strong>
        </label>
        <input
        className="medicament-input input-size-save-table"
          id="diagnosesInput"
          type="text"
          autoComplete="off"
          title={inputValue}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabledInput}
        />
      </div>
      {isDropdownVisible && (
        <ul className="autocomplete-dropdown-diagnoses">
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