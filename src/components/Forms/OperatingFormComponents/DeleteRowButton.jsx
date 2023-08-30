export const DeleteRowButton = ({ formIndex, rowIndex, formLocked, forms, setFormsWithStorage }) => {
  const onDeleteRow = () => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows.splice(rowIndex, 1);
    setFormsWithStorage(updatedForms); // Обновление localStorage
  };

  return (
    <button
      type="button"
      className="table1-btn red"
      onClick={onDeleteRow}
      disabled={formLocked}
    >
      <i className="bx bx-trash bx-sm"></i>
    </button>
  );
};

