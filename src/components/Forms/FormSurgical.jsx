import { useState } from "react";

import "./FormSurgical.css";

export const FormSurgical = () => {
  const [newRow, setNewRow] = useState([ ]);
  const [newForm, setnewForm] = useState([ ]);

  const onAddRow = () => {
    setNewRow([...newRow, { id: newRow.length}]);
  };

  const onAddNewForm= () => {
    setnewForm([...newForm, { id: newForm.length}]);
  };

  return (
    <>
    {newForm.map((row) => (
      <div className="form1" key={row.id + 1}>
        <div className="form1-icons">
          <i className="bx bx-lock-open-alt bx-sm form1-icon"></i>
          <i className="bx bx-copy bx-sm form1-icon"></i>
          <i className="bx bx-trash bx-sm form1-delete"></i>
        </div>
        <div className="form1-table">
          <table>
            <thead>
              <tr>
                <th id="date" className="form1-table-size1"></th>
                <th className="form1-table-title form1-table-size2" colSpan="2">
                  ХІРУРГІЯ
                </th>
                <th className="form1-table-size3" colSpan="3">
                  <select className="list-day">
                    <option value="1-2day">1-2 доби</option>
                    <option value="3days">3 доби</option>
                    <option value="4days">4 доби</option>
                    <option value="5days">5 діб</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody className="tbody1">
              <tr>
                <td colSpan="6">
                  <p className="form-table-name-user">
                    П.І.Б. лікаря: Пупкін Пуп Пупкович
                  </p>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <label htmlFor="forName"></label>
                  <input
                    id="forName"
                    type="name"
                    name="name"
                    placeholder="П.І.Б. відвідувача"
                    className="form-table-name"
                  />
                </td>
              </tr>
              <tr>
                <td className="form-table-text">Дії</td>
                <td colSpan="2">
                  <label>
                    <input
                      type="text"
                      name="action"
                      className="form-table-name"
                    />
                  </label>
                </td>
                <td className="form-table-text" colSpan="3">
                  Атрибути
                </td>
              </tr>
              <tr className="form-table2">
                <th>№</th>
                <th>Назва</th>
                <th>Кількість</th>
                <th>Тип</th>
                <th>Примітки</th>
                <th>Управління</th>
              </tr>
              {newRow.map((row) => (
                <tr className="form1-new-row" key={row.id}>
                  <th>{row.id + 1}</th>
                  <th>
                    <label>
                      <input
                        type="text"
                        name="action"
                        className="form-table-name"
                      />
                    </label>
                  </th>
                  <th>
                    <label>
                      <input
                        type="number"
                        name="number"
                        className="form1-table-text-name"
                      />
                    </label>
                  </th>
                  <th>
                    <select className="list-day">
                      <option value="units">шт.</option>
                      <option value="ampoules">амп.</option>
                      <option value="vials">фл.</option>
                      <option value="milliliters">мл.</option>
                      <option value="grams">гр.</option>
                    </select>
                  </th>
                  <th>
                    <label>
                      <input
                        type="text"
                        name="action"
                        className="form-table-name"
                      />
                    </label>
                  </th>
                  <th>
                    <button
                      type="button"
                      className="table1-btn blue copy-button1"
                    >
                      <i className="bx bx-copy bx-sm"></i>
                    </button>
                    <button
                      type="button"
                      className="table1-btn red delete-button1"
                    >
                      <i className="bx bx-trash bx-sm"></i>
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form1-btns">
            <button type="button" className="form1-btn-save">
              Зберегти форму
            </button>
            <button
              type="button"
              id="add-row-form1"
              className="form1-btn-add"
              onClick={onAddRow}
            >
              <i className="bx bx-plus bx-sm"></i>
            </button>
          </div>
        </div>
      </div>
      ))}
      <button
        type="button"
        id="add-row-form1"
        className="add-new-form1"
        onClick={onAddNewForm}
      >
        <i className="bx bx-plus bx-sm"></i>
      </button>
    </>
  );
};
