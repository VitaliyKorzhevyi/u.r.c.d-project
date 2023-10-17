import { useContext, useState } from "react"; //useState, useEffect, useRef
import { UserDataContext } from "../../pages/HomePage";

import { ModalPatientCreate } from "./СoreComponentsReports/ModalPatientCreate";
import { ModalPatientSearch } from "./СoreComponentsReports/ModalPatientSearch";

import "./ReportsConsultation.css";

export const ReportsConsultation = () => {
  const { myData } = useContext(UserDataContext);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);

  const [selectedPatientInfo, setSelectedPatientInfo] = useState({
    fullName: "",
    rowIndex: null,
    id: null,
  });

  const onSetPatientAge = (age) => {
    console.log("Років:", age);
  };

  const onSetPatientBirthday = (birthday) => {
    console.log("birthday:", birthday);
  };

  // const onPatientSelect = (id) => {
  //   console.log("ID:", id);
  // };

  const onSetPatientFullName = (fullName, id) => {
    console.log("fullName", fullName);
    console.log("id", id);
    const updatedRows = [...rows];

    // Обновите значение fullName только для соответствующей строки
    updatedRows[id].full_name = fullName;

    // Установите обновленный массив в состояние
    setRows(updatedRows);
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      number: 1,
      receipt_number: "",
      full_name: "піб",
      patient_id: "",
      is_free: false,
      discount: 0,
      medication_prescribed: false,
      notation: "",
    },
  ]);

  console.log(rows);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      number: rows.length + 1,
      receipt_number: "",
      full_name: "піб",
      patient_id: "",
      is_free: false,
      discount: 0,
      medication_prescribed: false,
      notation: "",
    };

    setRows([...rows, newRow]);
  };

  //* ДАНІ ПАЦІЄНТА

  //* ВІДОБРАЖЕННЯ ДАТИ
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const currentDate = getCurrentDate();

  //* МОДАЛЬНІ ВІКНА ДЛЯ СТВОРЕННЯ ТА ПОШУКУ ПАЦІЄНТА
  const toggleModalCreate = () => {
    setModalOpenCreate(!isModalOpenCreate);
  };

  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
  };
  return (
    <>
      <div className="consultation-table">
        <div className="form2-icons">
          <i className="bx bx-lock-open-alt bx-sm form1-icon"></i>
        </div>

        <table>
          <thead>
            <tr>
              <th colSpan="9" className="consultation-table-title">
                Консультація
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" className="consultation-table-size">
                {currentDate}
              </td>
              <td colSpan="7">
                <p>{myData.full_name}</p>
              </td>
            </tr>
            <tr className="consultation-table-semi-title">
              <td className="consultation-table-size1">№</td>
              <td>Номер талону квитанції</td>
              <td colSpan="2">відвідувач/хворий</td>
              <td className="consultation-table-size5">Платно</td>
              <td className="consultation-table-size2">Знижка</td>
              <td className="consultation-table-size2">Виписані ліки</td>
              <td className="consultation-table-size3">Примітки</td>
              <td className="consultation-table-size2">Управління</td>
            </tr>

            {rows.map((row) => {
              const id = row.id;
              return (
                <tr key={id}>
                  <td className="consultation-table-text">{row.number}</td>
                  <td>
                    <input
                      className="table-cons-receipt-number"
                      type="text"
                      value={row.receipt_number}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].receipt_number = e.target.value;
                        setRows(updatedRows);
                      }}
                    />
                  </td>
                  <td>
                    <p>{row.full_name}</p>
                  </td>

                  <td className="consultation-table-size4">
                    <div className="btns-patient">
                      <button
                        type="button"
                        className="btn-patient green"
                        onClick={() => {
                          toggleModalCreate();
                          setSelectedPatientInfo({
                            fullName: "",
                            id: id - 1,
                          });
                        }}
                      >
                        <i className="bx bx-plus bx-sm"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-patient blue one"
                        onClick={() => {
                          toggleModalSearch();
                          setSelectedPatientInfo({
                            fullName: "",
                            id: id - 1,
                          });
                        }}
                      >
                        <i className="bx bx-search bx-sm"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.is_free}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].is_free = e.target.checked;
                        setRows(updatedRows);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="table-cons-discount"
                      type="number"
                      value={row.discount}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].discount = e.target.value;
                        setRows(updatedRows);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.medication_prescribed}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].medication_prescribed =
                          e.target.checked;
                        setRows(updatedRows);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="table-cons-notation"
                      type="text"
                      value={row.notation}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].notation = e.target.value;
                        setRows(updatedRows);
                      }}
                    />
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="form1-btns">
          <button type="button" className="form1-btn-save">
            Зберегти форму
          </button>
          <button type="button" className="form1-btn-add" onClick={addRow}>
            <i className="bx bx-plus bx-sm"></i>
          </button>
        </div>
      </div>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetFullName={(fullName) => {
          onSetPatientFullName(fullName, selectedPatientInfo.id);
        }}
      />
      <ModalPatientCreate
        onGetFullName={(fullName) => {
          onSetPatientFullName(fullName, selectedPatientInfo.id);
        }}
        isOpen={isModalOpenCreate}
        onClose={toggleModalCreate}
        onGetAge={onSetPatientAge}
        onGetBirthday={onSetPatientBirthday}
      />
    </>
  );
};
