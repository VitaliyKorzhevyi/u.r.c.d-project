export const CopyRowButton = ({ formIndex, rowIndex, formLocked, forms, setFormsWithStorage }) => {
  const onCopyRow = () => {
    const updatedForms = [...forms];
    const rowToCopy = { ...updatedForms[formIndex].rows[rowIndex] };
    updatedForms[formIndex].rows.push(rowToCopy);
    setFormsWithStorage(updatedForms); // Обновление localStorage
  };

  return (
    <button
      type="button"
      className="table1-btn blue"
      onClick={onCopyRow}
      disabled={formLocked}
    >
      <i className="bx bx-copy bx-sm"></i>
    </button>
  );
};

