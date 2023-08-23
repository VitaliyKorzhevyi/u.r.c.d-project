export const TypeSelect = ({ formIndex, rowIndex, value, locked, forms, setForms }) => {
  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  return (
    <select
      className="list-day"
      value={value}
      onChange={(e) => onInputChange(formIndex, rowIndex, "type", e.target.value)}
      disabled={locked}
    >
      <option value="units">шт.</option>
      <option value="ampoules">амп.</option>
      <option value="vials">фл.</option>
      <option value="milliliters">мл.</option>
      <option value="grams">гр.</option>
    </select>
  );
};


