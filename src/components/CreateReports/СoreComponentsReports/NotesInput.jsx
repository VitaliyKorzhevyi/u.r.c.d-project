export const NotesInput = ({
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
    <textarea
      type="text"
      autoComplete="off"
      name="notation"
      className="form1-table-text-name notes"
      value={value}
      onChange={(e) =>
        onInputChange(formIndex, rowIndex, "notation", e.target.value)
      }
      disabled={locked}
    />
  );
};
