export const NotesInput = ({ formIndex, rowIndex, value, locked, forms, setForms }) => {
  const onInputChange = (formIndex, rowIndex, field, inputValue) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows[rowIndex][field] = inputValue;
    localStorage.setItem("operatingForms", JSON.stringify(updatedForms));
    setForms(updatedForms);
  };

  return (
    <input
      type="text"
      name="notation"
      className="form1-table-text-name"
      value={value}
      onChange={(e) => onInputChange(formIndex, rowIndex, "notation", e.target.value)}
      disabled={locked}
    />
  );
};

