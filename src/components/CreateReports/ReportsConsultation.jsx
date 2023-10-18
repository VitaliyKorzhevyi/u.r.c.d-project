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
          receipt_number: "",
          full_name: "",
          phone: "",
          patient_id: "",
          is_free: true,
          discount: 0,
          medication_prescribed: false,
          notation: "",
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
      receipt_number: "",
      full_name: "",
      phone: "",
      patient_id: "",
      is_free: true,
      discount: 0,
      medication_prescribed: false,
      notation: "",
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

  const toggleIsFree = (id) => {
    const updatedRows = [...rows];
    updatedRows[id - 1].is_free = !updatedRows[id - 1].is_free;

    // Если is_free устанавливается в true, установите значение discount в 0
    if (updatedRows[id - 1].is_free) {
      updatedRows[id - 1].discount = 0;
    }

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
    // Создайте переменную, чтобы отслеживать наличие пустых полей
    let hasEmptyFields = false;

    // Перебирайте каждый ряд и проверяйте поля
    rows.forEach((row) => {
      if (!row.receipt_number || !row.patient_id) {
        // Определите имя поля, которое должно быть заполнено
        let emptyFieldName = "";
        if (!row.receipt_number) {
          emptyFieldName = "Номер талону квитанції";
        } else if (!row.patient_id) {
          emptyFieldName = "відвідувач/хворий";
        }

        // Если есть пустое поле, установите флаг наличия пустых полей в true
        hasEmptyFields = true;

        // Выведите сообщение о пустом поле в консоль
        toast.warn(`Пусте поле '${emptyFieldName}' в рядку ${row.number}`);
      }
    });

    // Если есть пустые поля, не выполняйте отправку на сервер
    if (hasEmptyFields) {
      return;
    }

    const dataToSend = rows.map((row) => ({
      receipt_number: row.receipt_number,
      patient_id: row.patient_id,
      is_free: row.is_free,
      discount: row.discount,
      medication_prescribed: row.medication_prescribed,
      notation: row.notation,
    }));

    // Вызовите функцию для отправки данных на сервер
    saveDataToServer(dataToSend);
  };

  const saveDataToServer = (data) => {
    console.log("ОСЬ ЩО", data);
    $api
      .post("/consultations", data)
      .then((response) => {
        toast.success("Консультації успішно збережені", response.data);
        // Очистите таблицу после успешного сохранения
        setRows([
          {
            id: 1,
            number: 1,
            receipt_number: "",
            full_name: "",
            patient_id: "",
            is_free: false,
            discount: 0,
            medication_prescribed: false,
            notation: "",
          },
        ]);
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
      });
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
                Консультація
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
              <td className="consultation-table-size5">Платно</td>
              <td className="consultation-table-size6">Знижка %</td>
              <td className="consultation-table-size6">Виписані ліки</td>
              <td className="consultation-table-size3">Примітки</td>
              <td className="consultation-table-size2">Дії</td>
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
                      disabled={isTableDisabled}
                    />
                  </td>
                  <td>
                    <p>
                      {row.full_name} {row.phone}
                    </p>
                  </td>

                  <td className="consultation-table-size4">
                    <div className="btns-patient">
                      <button
                        type="button"
                        className={`btn-patient green ${
                          isTableDisabled ? "disabled" : ""
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
                        disabled={isTableDisabled}
                      >
                        <i className="bx bx-user-plus bx-sm"></i>
                      </button>
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
                    </div>
                  </td>
                  <td>
                    <div
                      onClick={() => toggleIsFree(id)}
                      className={`checkbox-isfree ${
                        isTableDisabled ? "disabled" : ""
                      }`}
                    >
                      {row.is_free ? (
                        <i className="bx bx-check bx-md"></i>
                      ) : null}
                    </div>
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
                    <input
                      className="table-cons-notation"
                      type="text"
                      value={row.notation}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[id - 1].notation = e.target.value;
                        setRows(updatedRows);
                      }}
                      disabled={isTableDisabled}
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
