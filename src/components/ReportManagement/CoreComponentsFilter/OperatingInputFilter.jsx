import { useState } from "react";

export const OperatingInputFilter = ({
  items,
  onItemSelect,
}) => {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const MIN_INPUT_LENGTH = 3;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownVisible(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="container-dropdown-filter">
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          autoComplete="off"
          value={inputValue}
          className="input-size-filter"
          onChange={handleInputChange}
        />
      </div>
      {isDropdownVisible && (
        <ul className="dropdown-filter">
          {filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setIsDropdownVisible(false);
                  onItemSelect(item.id);
                  setInputValue(item.title);
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