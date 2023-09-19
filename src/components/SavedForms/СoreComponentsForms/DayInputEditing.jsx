import { useState } from "react";
import { isThreeDaysOld } from "./dateUtils";

export const DayInputEditing = ({
  items,
  selectedItem,
  onItemSelect,
  createdAt,
}) => {
  const [inputValue, setInputValue] = useState(selectedItem || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const MIN_INPUT_LENGTH = 2;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const disabledInput = isThreeDaysOld(createdAt);

  return (
    <div className="autocomplete-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="dayInput" style={{ marginRight: "10px" }}>
        К-сть. діб:
        </label>
        <input
          id="dayInput"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabledInput}
        />
      </div>
      {isDropdownVisible && (
        <ul className="autocomplete-dropdown">
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
                  onItemSelect(item);
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
