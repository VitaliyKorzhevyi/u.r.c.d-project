//Todo якщо термін дії форми пройшов 3 дні то кнопка відправити та інпути будуть заблоковані

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import DatepickerComponent from "./Сalendar";
import $api from "../../api/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { DayInputEditing } from "./СoreComponentsReports/DayInputEditing";
import { DiagnosesInputEditing } from "./СoreComponentsReports/DiagnosesInputEditing";
import { OperatingInputEditing } from "./СoreComponentsReports/OperatingInputEditing";
import { MedicamentInputEditing } from "./СoreComponentsReports/MedicamentInputEditing";

import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";

import { ReportManagement } from "../ReportManagement/ReportManagement";

import "./EditReports.css";

import { isThreeDaysOld } from "./СoreComponentsReports/dateUtils";

export const EditReports = ({ userData }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [data, setData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  console.log("Редагувіання таблиці", userData);

  //* ДЛЯ ЗБЕРАГІННЯ ВІДРЕДАГОВАНИХ ЗНАЧЕНЬ
  const [formData, setFormData] = useState({
    id: null,
    history_number: null,
    patient_id: null,
    diagnosis_id: null,
    operation_id: null,
    preoperative_day_id: null,
    rows: [
      {
        id: null,
        medicament_id: null,
        quantity_of_medicament: null,
        unit_of_measurement: "шт",
        notation: "",
      },
    ],
  });

  //* ЗАПИТ ДНІВ (передопераційна доба)
  const [days, setDays] = useState([]);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);

  useEffect(() => {
    $api.get("/preoperative-days").then((response) => {
      console.log("Доба:", response.data);
      setDays(response.data);
    });
  }, []);

  const onDaySelect = (selectedDayId) => {
    setFormData((prevData) => ({
      ...prevData,
      preoperative_day_id: selectedDayId,
    }));
  };

  //* ЗАПИТ ДІАГНОЗІВ
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    $api.get("/diagnoses").then((response) => setDiagnoses(response.data));
  }, []);

  const onDiagnosesSelect = (selectedDiagnosesId) => {
    setFormData((prevData) => ({
      ...prevData,
      diagnosis_id: selectedDiagnosesId,
    }));
  };

  //* ЗАПИТ ОПЕРАЦІЙ
  const [operating, setOperating] = useState([]);

  useEffect(() => {
    $api.get("/operations").then((response) => setOperating(response.data));
  }, []);

  const onOperatingSelect = (selectedOperatingId) => {
    setFormData((prevData) => ({
      ...prevData,
      operation_id: selectedOperatingId,
    }));
  };

  //* ЗАПИТ МЕДИКАМЕНТІВ
  const [medicaments, setMedicaments] = useState([]);

  useEffect(() => {
    $api.get("/medicaments").then((response) => setMedicaments(response.data));
  }, []);

  const onMedicamentSelect = (rowIndex, selectedMedicamentId) => {
    setFormData((prevData) => {
      const rows = [...prevData.rows];
      if (rows[rowIndex]) {
        rows[rowIndex].medicament_id = selectedMedicamentId;
        return { ...prevData, rows };
      } else {
        console.warn("Row index not found:", rowIndex);
        return prevData;
      }
    });
  };

  //* РЕДАГУВАННЯ НОМЕРА ІСТОРІЇ
  const onInputChange = (e, id, type) => {
    const newValue = e.target.value;

    // Обновляем formData
    setFormData((prevData) => ({
      ...prevData,
      history_number: newValue,
    }));

    setData((prevData) => {
      return prevData.map((item) => {
        if (item.id === id && item.type === type) {
          return {
            ...item,
            history_number: newValue,
          };
        }
        return item;
      });
    });
  };

  //* РЕДАГУВАННЯ ПАЦІЄНТА
  const onPatientSelect = (selectedPatientId) => {
    setFormData((prevData) => ({
      ...prevData,
      patient_id: selectedPatientId,
    }));
  };

  const onSetPatientFullName = (fullName) => {
    if (selectedItem) {
      const updatedData = data.map((item) => {
        if (item.id === selectedItem.id && item.type === selectedItem.type) {
          return { ...item, patient_full_name: fullName };
        }
        return item;
      });
      setData(updatedData);
    }
  };

  const updatePatientDetail = (field, value) => {
    if (selectedItemDetails) {
      setSelectedItemDetails((prevDetails) => ({
        ...prevDetails,
        patient: {
          ...prevDetails.patient,
          [field]: value,
        },
      }));
    }
  };

  const onSetPhone = (phone) => {
    updatePatientDetail("phone", phone);
  };

  const onSetBirthday = (birthday) => {
    updatePatientDetail("birthday", birthday);
  };

  const onSetAge = (age) => {
    updatePatientDetail("age", age);
  };

  //* РЕДАГУВАННЯ ОДИНИЦІ ВИМІРУ
  const updateRowsField = (rows, rowIndex, field, value) => {
    if (!rows[rowIndex]) {
      console.warn("Row index not found:", rowIndex);
      return rows;
    }
    const updatedRows = [...rows];
    updatedRows[rowIndex][field] = value;
    return updatedRows;
  };

  const onRowFieldChange = (rowIndex, field, value) => {
    setSelectedItemDetails((prevDetails) => ({
      ...prevDetails,
      rows: updateRowsField(prevDetails.rows, rowIndex, field, value),
    }));

    setFormData((prevData) => ({
      ...prevData,
      rows: updateRowsField(prevData.rows, rowIndex, field, value),
    }));
  };

  //* ДЛЯ ВИБОРУ ДАТИ
  const onDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  //* ДЛЯ ВІДОБРАЖЕННЯ СПИСКУ ТАБЛИЦІ
  //* по дефолту

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const getCurrentDate = useCallback(() => {
    return formatDate(new Date());
  }, []);

  const getDateFromDaysAgo = useCallback((daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return formatDate(date);
  }, []);

  useEffect(() => {
    const currentDate = getCurrentDate();
    const dateTenDaysAgo = getDateFromDaysAgo(10);

    const url = `/reports`;
    const options = {
      params: {
        page: 1,
        limit: 20,
        from_created_at: dateTenDaysAgo,
        to_created_at: currentDate,
      },
    };

    $api
      .get(url, options)
      .then((response) => {
        setData(response.data.reports);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
      });
  }, [getCurrentDate, getDateFromDaysAgo]);

  //* при натисканны на кнопку
  const onButtonClick = () => {
    if (selectedStartDate && selectedEndDate) {
      const url = `/reports?page=1&limit=20&from_created_at=${selectedStartDate}&to_created_at=${selectedEndDate}`;

      $api
        .get(url)
        .then((response) => {
          setData(response.data.reports);
          setTotalPages(response.data.total_pages);
        })
        .catch((error) => {
          console.error(
            "Error fetching data:",
            error.response ? error.response.data : error
          );
        });
    } else {
      console.warn(
        "Please select both start and end dates before making a request."
      );
    }
  };

  //* ПАГІНАЦІЯ
  const fetchData = (url) => {
    $api.get(url).then((response) => {
      setData(response.data.reports);
      setTotalPages(response.data.total_pages);
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newUrl = `/reports?page=${page}&limit=20&from_created_at=${selectedStartDate}&to_created_at=${selectedEndDate}`;
    fetchData(newUrl);
  };

  const targetComponentRef = useRef(null);

  //* ДЛЯ ВІДОБРАЖЕННЯ ВСІЄЇ ТАБЛИЦІ
  const onFormDataById = (item) => {
    setLoading(true);
    setSelectedItem({ id: item.id, type: item.type });
    const url = `reports/${item.type}/${item.id}`;
    $api
      .get(url)
      .then((response) => {
        setSelectedItemDetails(response.data);

        // Преобразовываем данные для formData
        const transformedData = {
          id: response.data.id,
          history_number: response.data.history_number,
          patient_id: response.data.patient.id,
          diagnosis_id: response.data.diagnosis.id,
          operation_id: response.data.operation.id,
          preoperative_day_id: response.data.preoperative_day.id,
          rows: response.data.rows.map((row) => ({
            id: row.id,
            medicament_id: row.medicament.id,
            quantity_of_medicament: row.quantity_of_medicament,
            unit_of_measurement: row.unit_of_measurement,
            notation: row.notation,
          })),
        };

        // Задаем данные в состояние
        setFormData(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching table:", error);
        setLoading(false);
      });
  };

  const REPORT_TYPE_NAMES = {
    operating: "Операційна",
    anesthesiology: "Анестезіологія",
    resuscitation: "Реанімація",
  };

  //* ДЛЯ відправки інформації на сервер
  const onSaveChanges = () => {
    if (!selectedItem) {
      console.warn("No table selected!");
      return;
    }

    const url = `/reports/${selectedItem.type}`;

    $api
      .put(url, formData)
      .then((response) => {
        const item = response.data;
        onFormDataById(item);
        toast.success(`Нова таблиця успішно оновлена`, {
          autoClose: 1500,
        });
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
  };

  return (
    <div className="container-saved-forms">
      <div className="calendar-saved-forms">
        <div className="management-saved-forms">
          <DatepickerComponent onDateChange={onDateChange} />
          <ReportManagement userData={userData} />
        </div>
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
      </div>
      <div>
        <ul className="list-saved-forms" ref={targetComponentRef}>
          {data.map(
            ({ id, type, patient_full_name, history_number, created_at }) => {
              const itemKey = `${id}-${type}`;
              const activeKey = selectedItem
                ? `${selectedItem.id}-${selectedItem.type}`
                : null;
              return (
                <li key={itemKey} className="item-saved-forms">
                  <div className="mini-form">
                    <table>
                      <tbody>
                        <tr>
                          <td
                            className={`semititle-size1 ${
                              isThreeDaysOld(created_at)
                                ? "yellow-background"
                                : "green-background"
                            }`}
                          >
                            <p>
                              <strong>Форма:</strong>{" "}
                              {REPORT_TYPE_NAMES[type] || type}
                            </p>
                          </td>
                          <td>
                            <strong>Пацієнт:</strong> {patient_full_name}
                          </td>
                          <td className="semititle-size3 ">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <label
                                htmlFor="historyInput"
                                className="number-history-padding"
                              >
                                <strong>№:</strong>
                              </label>
                              {isThreeDaysOld(created_at) ? (
                                <span className="text-head-saved-forms">
                                  {history_number}
                                </span>
                              ) : (
                                <input
                                  id="historyInput"
                                  type="text"
                                  title={history_number}
                                  style={{ textAlign: "center" }}
                                  className="history-input"
                                  value={history_number}
                                  onChange={(e) => onInputChange(e, id, type)}
                                  disabled={isThreeDaysOld(created_at)}
                                />
                              )}
                            </div>
                          </td>

                          <td className="semititle-size2">
                            <p className="text-semititle">
                              <strong>Дата створення:</strong>{" "}
                              {new Date(created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td
                            className="semititle-size4"
                            onClick={() => onFormDataById({ id, type })}
                          >
                            <i
                              className={`bx ${
                                itemKey === activeKey
                                  ? "rotate-180"
                                  : "rotate-0"
                              } bx-chevron-down bx-md`}
                            ></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {!loading &&
                    selectedItem &&
                    selectedItem.id === id &&
                    selectedItem.type === type &&
                    selectedItemDetails && (
                      <>
                        <table border="1" className="table-save">
                          <thead>
                            <tr>
                              <th colSpan="2" className="semi-title-color">
                                Телефон:{" "}
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.phone}
                                </span>
                              </th>
                              <th colSpan="4" className="semi-title-color">
                                Дата народження:{" "}
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.birthday}
                                </span>
                              </th>
                            </tr>
                            <tr>
                              <th colSpan="2" className="semi-title-color">
                                Вік:{" "}
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.age}
                                </span>
                              </th>
                              <th colSpan="4" className="semi-title-color">
                                {isThreeDaysOld(created_at) ? (
                                  <span className="text-head-saved-forms">
                                    <strong>К-сть. діб:</strong>{" "}
                                    {selectedItemDetails.preoperative_day.title}
                                  </span>
                                ) : (
                                  <DayInputEditing
                                    items={days}
                                    selectedItem={
                                      selectedItemDetails.preoperative_day.title
                                    }
                                    onItemSelect={onDaySelect}
                                    createdAt={created_at}
                                  />
                                )}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {isThreeDaysOld(created_at) ? (
                                <td
                                  colSpan="6"
                                  className="text-size-saved-forms"
                                >
                                  <span className="text-head-saved-forms">
                                    <strong>Діагноз:</strong>{" "}
                                    {selectedItemDetails.diagnosis.title}
                                  </span>
                                </td>
                              ) : (
                                <td colSpan="6">
                                  <DiagnosesInputEditing
                                    items={diagnoses}
                                    selectedItem={
                                      selectedItemDetails.diagnosis.title
                                    }
                                    onItemSelect={onDiagnosesSelect}
                                    createdAt={created_at}
                                  />
                                </td>
                              )}
                            </tr>
                            <tr>
                              {isThreeDaysOld(created_at) ? (
                                <td
                                  colSpan="6"
                                  className="text-size-saved-forms"
                                >
                                  <span className="text-head-saved-forms">
                                    <strong>Операція:</strong>{" "}
                                    {selectedItemDetails.operation.title}
                                  </span>
                                </td>
                              ) : (
                                <td colSpan="6">
                                  <OperatingInputEditing
                                    items={operating}
                                    selectedItem={
                                      selectedItemDetails.operation.title
                                    }
                                    onItemSelect={onOperatingSelect}
                                    createdAt={created_at}
                                  />
                                </td>
                              )}
                            </tr>
                            <tr className="semi-title-color">
                              <td className="table-save-size3">
                                <p>
                                  <strong>Назва препарату</strong>
                                </p>
                              </td>
                              <td className="table-save-size">
                                <strong>К-сть.</strong>
                              </td>
                              <td className="table-save-size2">
                                <strong>Тип</strong>
                              </td>
                              <td>
                                <strong>Примітки</strong>
                              </td>
                              <td>
                                <strong>Апт.</strong>
                              </td>
                              <td>
                                <strong>Бух.</strong>
                              </td>
                            </tr>
                            {selectedItemDetails.rows.map((row, index) => (
                              <tr key={row.id}>
                                <td>
                                  {isThreeDaysOld(created_at) ? (
                                    <span className="text-head-saved-forms">
                                      {row.medicament.title}
                                    </span>
                                  ) : (
                                    <MedicamentInputEditing
                                      items={medicaments}
                                      selectedItem={row.medicament.title}
                                      onItemSelect={(medicamentId) =>
                                        onMedicamentSelect(index, medicamentId)
                                      }
                                      createdAt={created_at}
                                    />
                                  )}
                                </td>
                                <td>
                                  {isThreeDaysOld(created_at) ? (
                                    <p
                                      className="text-head-saved-forms"
                                      style={{ textAlign: "center" }}
                                    >
                                      {row.quantity_of_medicament}
                                    </p>
                                  ) : (
                                    <input
                                      type="number"
                                      className="history-input"
                                      style={{ textAlign: "center" }}
                                      value={row.quantity_of_medicament}
                                      onChange={(e) =>
                                        onRowFieldChange(
                                          index,
                                          "quantity_of_medicament",
                                          e.target.value
                                        )
                                      }
                                      disabled={isThreeDaysOld(created_at)}
                                    />
                                  )}
                                </td>
                                <td>
                                  {isThreeDaysOld(created_at) ? (
                                    <p
                                      className="text-head-saved-forms"
                                      style={{ textAlign: "center" }}
                                    >
                                      {row.unit_of_measurement}
                                    </p>
                                  ) : (
                                    <select
                                      value={row.unit_of_measurement}
                                      onChange={(e) =>
                                        onRowFieldChange(
                                          index,
                                          "unit_of_measurement",
                                          e.target.value
                                        )
                                      }
                                      disabled={isThreeDaysOld(created_at)}
                                    >
                                      <option value="шт.">шт.</option>
                                      <option value="амп.">амп.</option>
                                      <option value="фл.">фл.</option>
                                      <option value="мл.">мл.</option>
                                      <option value="гр.">гр.</option>
                                      <option value="пар">пар</option>
                                    </select>
                                  )}
                                </td>
                                <td>
                                  {isThreeDaysOld(created_at) ? (
                                    <p className="text-head-saved-forms">
                                      {row.notation}
                                    </p>
                                  ) : (
                                    <input
                                      type="text"
                                      className="history-input"
                                      title={row.notation || ""}
                                      value={row.notation || ""}
                                      onChange={(e) =>
                                        onRowFieldChange(
                                          index,
                                          "notation",
                                          e.target.value
                                        )
                                      }
                                      disabled={isThreeDaysOld(created_at)}
                                    />
                                  )}
                                </td>
                                <td className="table-save-size1">
                                  <p className="check-static">
                                    {row.mark &&
                                    row.mark.type === "pharmacy" ? (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        size="xl"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </td>
                                <td className="table-save-size1">
                                  <p className="check-static">
                                    {row.mark &&
                                    row.mark.type === "accounting" ? (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        size="xl"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="btns-save-table-container">
                          <button
                            type="button"
                            className={`btn-save-table ${
                              !isThreeDaysOld(created_at) ? "blue" : ""
                            }`}
                            onClick={() => {
                              toggleModalSearch();
                            }}
                            disabled={isThreeDaysOld(created_at)}
                          >
                            Редагувати пацієнта
                          </button>
                          <button
                            type="button"
                            className={`btn-save-table ${
                              !isThreeDaysOld(created_at) ? "green" : ""
                            }`}
                            onClick={() => onSaveChanges(type)}
                            disabled={isThreeDaysOld(created_at)}
                          >
                            Зберегти зміни
                          </button>
                        </div>
                      </>
                    )}
                </li>
              );
            }
          )}
        </ul>
        <div className="pagination">
          {totalPages > 1 &&
            Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`pagination-button ${
                  index + 1 === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
        </div>
      </div>

      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={onPatientSelect}
        onGetFullName={onSetPatientFullName}
        onGetPhone={onSetPhone}
        onGetBirthday={onSetBirthday}
        onGetAge={onSetAge}
      />
    </div>
  );
};
