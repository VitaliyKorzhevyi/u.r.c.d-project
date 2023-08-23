export const QuantityInput = ({ formIndex, rowIndex, value, locked, forms, setForms }) => {
  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem("anesthesiologyForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  return (
    <input
      type="number"
      name="number"
      className="form1-table-text-name"
      value={value}
      onChange={(e) => onInputChange(formIndex, rowIndex, "quantity", e.target.value)}
      disabled={locked}
    />
  );
};

