export const TypeSelect = ({
  formIndex,
  rowIndex,
  value,
  locked,
  forms,
  setForms,
  localStorageKey,
}) => {
  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem(localStorageKey, JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  return (
    <select
      className="list-day"
      value={value}
      onChange={(e) =>
        onInputChange(
          formIndex,
          rowIndex,
          "unit_of_measurement",
          e.target.value
        )
      }
      disabled={locked}
    >
      <option value="" disabled hidden></option>
      <option value="шт">шт</option>
      <option value="амп">амп</option>
      <option value="фл">фл</option>
      <option value="мл">мл</option>
      <option value="гр">гр</option>
      <option value="пар">пар</option>
    </select>
  );
};
