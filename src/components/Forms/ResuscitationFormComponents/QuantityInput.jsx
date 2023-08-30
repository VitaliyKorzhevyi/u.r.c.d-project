export const QuantityInput = ({ formIndex, rowIndex, value, locked, forms, setForms }) => {
  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem("resuscitationForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  return (
    <input
      type="number"
      name="quantity_of_medicament"
      className="form1-table-text-name"
      value={value}
      onChange={(e) => onInputChange(formIndex, rowIndex, "quantity_of_medicament", e.target.value)}
      disabled={locked}
    />
  );
};

