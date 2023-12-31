import { useContext, useState, useEffect } from "react"; //useState, useEffect, useRef
import { UserDataContext } from "../../pages/HomePage";
import { toast } from "react-toastify";
import { ModalPatientCreate } from "./СoreComponentsReports/ModalPatientCreate";
import { ModalPatientSearch } from "./СoreComponentsReports/ModalPatientSearch";

import "./ReportsConsultation.css";
import $api from "../../api/api";

export const ReportsConsultation = () => {
  const { myData } = useContext(UserDataContext);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);
  const [isTableDisabled, setTableDisabled] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [selectedPatientInfo, setSelectedPatientInfo] = useState({
    fullName: "",
    id: null,
  });

  const [selectedPatientId, setSelectedPatientId] = useState({
    idPatient: "",
    id: null,
  });

  const [selectedPatientPhone, setSelectedPatientPhone] = useState({
    phone: "",
    id: null,
  });

  const onSetPatientAge = (age) => {
    console.log("Років:", age);
  };

  const onSetPatientBirthday = (birthday) => {
    console.log("birthday:", birthday);
  };

  const onSetPatientPhone = (Phone, id) => {
    const updatedRows = [...rows];
    updatedRows[id].phone = Phone;
    setRows(updatedRows);
  };

  const onSetPatientId = (idPatient, id) => {
    const updatedRows = [...rows];
    updatedRows[id].patient_id = idPatient;
    setRows(updatedRows);
  };

  const onSetPatientFullName = (fullName, id) => {
    const updatedRows = [...rows];
    updatedRows[id].full_name = fullName;
    setRows(updatedRows);
  };

  const onFieldChange = (btnActiveCreate, id) => {
    const updatedRows = [...rows];
    updatedRows[id].btnActiveCreate = btnActiveCreate;
    setRows(updatedRows);
  };

  const [rows, setRows] = useState(() => {
    const localStorageData = localStorage.getItem("Concultation");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      return parsedData;
    } else {
      return [
        {
          id: 1,
          number: 1,
          receipt_number: null,
          full_name: "",
          phone: "",
          btnActiveCreate: false,
          patient_id: "",
          payment_amount: 0,
          medication_prescribed: false,
          notation: null,
        },
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem("Concultation", JSON.stringify(rows));
  }, [rows]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      number: rows.length + 1,
      receipt_number: null,
      full_name: "",
      phone: "",
      patient_id: "",
      payment_amount: 0,
      medication_prescribed: false,
      notation: null,
    };

    setRows([...rows, newRow]);
  };

  //* КЕРУВАННЯ РЯДКОМ

  const copyRow = (id) => {
    const selectedRow = rows.find((row) => row.id === id);
    if (selectedRow) {
      // Найдите максимальное значение id
      const maxId = Math.max(...rows.map((row) => row.id));
      const newId = maxId + 1;

      // Создайте новую строку с уникальными id и number
      const newRow = { ...selectedRow, id: newId, number: newId };

      setRows([...rows, newRow]);
    }
  };

  const deleteRow = (idToDelete) => {
    // Фильтруем массив, исключая рядок с заданным id
    const updatedRows = rows.filter((row) => row.id !== idToDelete);

    // Пересчитываем id и number для каждого ряда
    updatedRows.forEach((row, index) => {
      row.id = index + 1;
      row.number = index + 1;
    });

    // Устанавливаем новый массив с обновленными рядами
    setRows(updatedRows);
  };

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

  //* ЧЕКБОКСИ

  const toggleMedicationRescribed = (id) => {
    const updatedRows = [...rows];
    updatedRows[id - 1].medication_prescribed =
      !updatedRows[id - 1].medication_prescribed;
    setRows(updatedRows);
  };

  //* ОТПРАВКА НА БЕК

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleSaveButtonClick = () => {
    let hasEmptyFields = false;
    rows.forEach((row) => {
      if (!row.patient_id) {
        hasEmptyFields = true;
        toast.warn(`Пусте поле "відвідувач/хворий" в рядку ${row.number}`);
      }
      if (row.receipt_number && row.receipt_number.length > 10) {
        hasEmptyFields = true;
        toast.warn(
          `Поле "Номер талону квитанції" в рядку ${row.number} повинно містити не більше 10 символів`
        );
      }
      if (row.notation && row.notation.length > 500) {
        hasEmptyFields = true;
        toast.warn(
          `Поле "Примітки" в рядку ${row.number} повинно містити не більше 500 символів`
        );
      }
      if (row.notation && row.notation.length < 3) {
        hasEmptyFields = true;
        toast.warn(
          `Поле "Примітки" в рядку ${row.number} повинно містити не менше 3 символів`
        );
      }
    });

    if (hasEmptyFields) {
      return;
    }

    const dataToSend = rows.map((row) => ({
      receipt_number: row.receipt_number,
      patient_id: row.patient_id,
      is_free: row.is_free,
      payment_amount: row.payment_amount,
      medication_prescribed: row.medication_prescribed,
      notation: row.notation,
    }));
    saveDataToServer(dataToSend);
  };

  const saveDataToServer = (data) => {
    console.log("ОСЬ ЩО", data);
    $api
      .post("/consultations", data)
      .then((response) => {
        toast.success("Консультації успішно збережені", response.data);
        setRows([
          {
            id: 1,
            number: 1,
            receipt_number: null,
            full_name: "",
            patient_id: "",
            payment_amount: 0,
            medication_prescribed: false,
            notation: null,
          },
        ]);
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
      });
  };

  const handleReceiptNumberChange = (e, id) => {
    const updatedRows = [...rows];
    const newValue = e.target.value;
    updatedRows[id - 1].receipt_number = newValue !== "" ? newValue : null;
    setRows(updatedRows);
  };

  const handleNotationChange = (e, id) => {
    const updatedRows = [...rows];
    const newValue = e.target.value;
    updatedRows[id - 1].notation = newValue !== "" ? newValue : null;
    setRows(updatedRows);
  };

  return (
    <>
      <div className="consultation-table">
        <div className="form2-icons">
          <i
            className={`bx bx-lock-open-alt bx-sm form1-icon ${
              isTableDisabled ? "disabled" : ""
            }`}
            onClick={() => {
              setTableDisabled(!isTableDisabled); // Изменяем состояние при нажатии на иконку
            }}
          ></i>
        </div>

        <table disabled>
          <thead>
            <tr>
              <th colSpan="9" className="consultation-table-title">
                Звітний документ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan="2"
                className="consultation-table-size consultation-table-my-date"
              >
                {currentDate}
              </td>
              <td colSpan="7">
                <p className="consultation-table-my-fullname">
                  {myData.full_name} ({myData.job_title})
                </p>
              </td>
            </tr>
            <tr className="consultation-table-semi-title">
              <td className="consultation-table-size1">№</td>
              <td className="consultation-table-receipt-number">
                Номер талону квитанції
              </td>
              <td colSpan="2" className="consultation-table-patient-st">
                відвідувач/хворий
              </td>
              <td className="consultation-table-size6">Оплата</td>
              <td className="consultation-table-size5">Виписані ліки</td>
              <td className="consultation-table-size3">Примітки</td>
              <td className="consultation-table-size2">Дії</td>
            </tr>

            {rows.map((row) => {
              const id = row.id;
              return (
                <tr key={id} className="consultation-table-text-info">
                  <td className="consultation-table-text">{row.number}</td>
                  <td>
                    <input
                      className="table-cons-receipt-number"
                      type="text"
                      value={row.receipt_number || ""}
                      maxLength={10}
                      onChange={(e) => handleReceiptNumberChange(e, id)}
                      disabled={isTableDisabled}
                    />
                  </td>
                  <td>
                    <div className="consultation-table-text-group">
                      <p>{row.full_name}</p>
                      <p>{row.phone}</p>
                    </div>
                  </td>

                  <td className="consultation-table-size4">
                    <div className="btns-patient">
                      <button
                        type="button"
                        className={`btn-patient blue one ${
                          isTableDisabled ? "disabled" : ""
                        }`}
                        onClick={() => {
                          toggleModalSearch();
                          setSelectedPatientInfo({
                            fullName: "",
                            id: id - 1,
                          });
                          setSelectedPatientId({
                            idPatient: "",
                            id: id - 1,
                          });
                          setSelectedPatientPhone({
                            phone: "",
                            id: id - 1,
                          });
                        }}
                        disabled={isTableDisabled}
                      >
                        <i className="bx bx-search bx-sm"></i>
                      </button>
                      <button
                        type="button"
                        className={`btn-patient ${
                          isTableDisabled ? "disabled" : ""
                        } ${
                          !row.btnActiveCreate ? "inactive" : "green"
                        }`}
                        onClick={() => {
                          toggleModalCreate();
                          setSelectedPatientInfo({
                            fullName: "",
                            id: id - 1,
                          });
                          setSelectedPatientId({
                            idPatient: "",
                            id: id - 1,
                          });
                          setSelectedPatientPhone({
                            phone: "",
                            id: id - 1,
                          });
                        }}
                        disabled={isTableDisabled || !row.btnActiveCreate}
                      >
                        <i className="bx bx-user-plus bx-sm"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      className="table-cons-discount"
                      type="number"
                      value={row.payment_amount === 0 ? "" : row.payment_amount}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        const newValue = parseInt(e.target.value, 10);
                        if (!isNaN(newValue) && newValue >= 0) {
                          updatedRows[id - 1].payment_amount = newValue;
                          setRows(updatedRows);
                        } else {
                          updatedRows[id - 1].payment_amount = 0;
                          setRows(updatedRows);
                        }
                      }}
                      disabled={isTableDisabled}
                    />
                  </td>
                  <td>
                    <div
                      onClick={() => toggleMedicationRescribed(id)}
                      className={`checkbox-isfree ${
                        isTableDisabled ? "disabled" : ""
                      }`}
                    >
                      {row.medication_prescribed ? (
                        <i className="bx bx-check bx-md"></i>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <textarea
                      className="table-cons-notation"
                      type="text"
                      value={row.notation || ""}
                      onChange={(e) => handleNotationChange(e, id)}
                      disabled={isTableDisabled}
                      maxLength={500}
                    />
                  </td>
                  <td>
                    <div className="table-cons-btns-manag-rows">
                      <button
                        type="button"
                        className={`table-cons-btn blue ${
                          isTableDisabled ? "disabled" : ""
                        }`}
                        onClick={() => copyRow(id)}
                        disabled={isTableDisabled}
                      >
                        <i className="bx bx-copy bx-sm"></i>
                      </button>
                      <button
                        type="button"
                        className={`table-cons-btn red ${
                          isTableDisabled ? "disabled" : ""
                        }`}
                        onClick={() => deleteRow(id)}
                        disabled={isTableDisabled}
                      >
                        <i className="bx bx-trash bx-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="form1-btns">
          <button
            type="button"
            className={`form1-btn-save ${isTableDisabled ? "disabled" : ""}`}
            disabled={isTableDisabled}
            onClick={openConfirmationModal}
          >
            Зберегти
          </button>
          <button
            type="button"
            className={`form1-btn-add ${isTableDisabled ? "disabled" : ""}`}
            onClick={addRow}
            disabled={isTableDisabled}
          >
            <i className="bx bx-plus bx-sm"></i>
          </button>
        </div>
      </div>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={(idPatient) => {
          onSetPatientId(idPatient, selectedPatientId.id);
        }}
        onGetFullName={(fullName) => {
          onSetPatientFullName(fullName, selectedPatientInfo.id);
        }}
        onGetPhone={(Phone) => {
          onSetPatientPhone(Phone, selectedPatientPhone.id);
        }}
        onShowBtnCreate={(btnActiveCreate) =>
          onFieldChange(btnActiveCreate, selectedPatientPhone.id)
        }
      />
      <ModalPatientCreate
        onGetFullName={(fullName) => {
          onSetPatientFullName(fullName, selectedPatientInfo.id);
        }}
        isOpen={isModalOpenCreate}
        onClose={toggleModalCreate}
        onGetId={(idPatient) => {
          onSetPatientId(idPatient, selectedPatientId.id);
        }}
        onGetPhone={(Phone) => {
          onSetPatientPhone(Phone, selectedPatientPhone.id);
        }}
        onGetAge={onSetPatientAge}
        onGetBirthday={onSetPatientBirthday}
      />
      {isConfirmationModalOpen && (
        <div className="confirm-modal">
          <p>Зберегти консультації?</p>
          <div className="confirm-modal-btn-save">
            <button onClick={closeConfirmationModal}>Ні</button>
            <button
              onClick={() => {
                handleSaveButtonClick();
                closeConfirmationModal();
              }}
            >
              Так
            </button>
          </div>
        </div>
      )}
    </>
  );
};
