//Todo якщо термін дії форми пройшов 3 дні то кнопка відправити та інпути будуть заблоковані

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import DatepickerComponent from "./Сalendar";
import ReactPaginate from "react-paginate";
import $api from "../../api/api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { DayInputEditing } from "./СoreComponentsReports/DayInputEditing";
import { DiagnosesInputEditing } from "./СoreComponentsReports/DiagnosesInputEditing";
import { OperatingInputEditing } from "./СoreComponentsReports/OperatingInputEditing";
import { MedicamentInputEditing } from "./СoreComponentsReports/MedicamentInputEditing";

import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";

import { ReportsManagement } from "../ReportsManagement/ReportsManagement";

import "./EditReports.css";

import { isThreeDaysOld } from "./СoreComponentsReports/dateUtils";

export const EditReports = ({ userData }) => {
  const [data, setData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(0);

  const [currentFormData, setCurrentFormData] = useState({});

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
  const formatDateDefoult = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  const formattedThirtyDaysAgo = formatDateDefoult(thirtyDaysAgo);
  const formattedCurrentDate = formatDateDefoult(currentDate);

  const [selectedStartDate, setSelectedStartDate] = useState(
    formattedThirtyDaysAgo
  );
  const [selectedEndDate, setSelectedEndDate] = useState(formattedCurrentDate);

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
    const dateTenDaysAgo = getDateFromDaysAgo(30);

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
        setTotalPages(response.data.total_pages);
        console.log("Total pages from server:", response.data.total_pages);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
      });
  }, [getCurrentDate, getDateFromDaysAgo]);

  //* при натисканні на кнопку

  const onFormDataChange = (newFormData) => {
    setCurrentFormData(newFormData);
  };

  const onButtonClick = () => {
    if (selectedStartDate && selectedEndDate) {
      const initialParams = {
        page: 1,
        from_created_at: selectedStartDate,
        to_created_at: selectedEndDate,
        ...currentFormData,
      };

      const params = Object.keys(initialParams)
        .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
        .reduce((obj, key) => {
          obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
          return obj;
        }, {});

      const queryString = new URLSearchParams(params).toString();
      const url = `/reports?${queryString}`;
      console.log(url);

      $api
        .get(url)
        .then((response) => {
          setData(response.data.reports);
          setTotalPages(response.data.total_pages);
          console.log("Total pages from server:", response.data.total_pages);
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
    // setCurrentPage(page);
    const initialParams = {
      page: page,
      from_created_at: selectedStartDate,
      to_created_at: selectedEndDate,
      ...currentFormData,
    };

    const params = Object.keys(initialParams)
      .filter((key) => initialParams[key])
      .reduce((obj, key) => {
        obj[key] = initialParams[key];
        return obj;
      }, {});

    const queryString = new URLSearchParams(params).toString();
    const url = `/reports?${queryString}`;
    fetchData(url);
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
    surgery: "Хірургія",
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
        toast.success(`Новий звіт успішно оновлена`, {
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
          <div>
            <DatepickerComponent
              onDateChange={onDateChange}
              startDate={thirtyDaysAgo}
              endDate={currentDate}
            />
          </div>

          <ReportsManagement
            userData={userData}
            onFormDataChange={onFormDataChange}
          />
          <button
            type="button"
            className="btn-calendar"
            onClick={onButtonClick}
          >
            Знайти
          </button>
        </div>
      </div>
      <div className="container-saved-forms-size">
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
                            className={`table-save-size4 ${
                              isThreeDaysOld(created_at) ? "yellow" : "green"
                            }`}
                          ></td>
                          <td className="semititle-size1">
                            <p>
                              <strong>Звіт:</strong>{" "}
                              {REPORT_TYPE_NAMES[type] || type}
                            </p>
                          </td>
                          <td className="semititle-size5">
                            <p className="semititle-size5">
                              <strong>Пацієнт:</strong> {patient_full_name}
                            </p>
                          </td>
                          <td className="semititle-size3">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
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
                                  autoComplete="off"
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
                            <div>
                              {" "}
                              <i
                                className={`bx ${
                                  itemKey === activeKey
                                    ? "bx-refresh bx-sm"
                                    : "bxs-chevron-down bx-sm"
                                }`}
                              ></i>
                            </div>
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
                          <tbody>
                            <tr>
                              <td colSpan="2">
                                <strong>Телефон: </strong>
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.phone}
                                </span>
                              </td>
                              <td colSpan="4">
                                <strong>Дата народження: </strong>
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.birthday.split("-").reverse().join(".")}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <strong>Вік: </strong>
                                <span className="text-head-saved-forms">
                                  {selectedItemDetails.patient.age}
                                </span>
                              </td>
                              <td colSpan="4">
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
                              </td>
                            </tr>
                            <tr>
                              {isThreeDaysOld(created_at) ? (
                                <td
                                  colSpan="6"
                                  className="text-size-saved-forms"
                                >
                                  <span className="text-head-saved-forms">
                                    <strong>Діагноз:</strong>{" "}
                                    {selectedItemDetails.diagnosis && selectedItemDetails.diagnosis.title}
                                  </span>
                                </td>
                              ) : (
                                <td colSpan="6">
                                  <DiagnosesInputEditing
                                    items={diagnoses}
                                    selectedItem={
                                      selectedItemDetails.diagnosis && selectedItemDetails.diagnosis.title
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
                                      autoComplete="off"
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
                                    <textarea
                                      type="text"
                                      autoComplete="off"
                                      className="notation-input "
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
                        {!isThreeDaysOld(created_at) ? (
                          <div className="btns-save-table-container">
                            <button
                              type="button"
                              className="btn-save-table blue"
                              onClick={() => {
                                toggleModalSearch();
                              }}
                              disabled={isThreeDaysOld(created_at)}
                            >
                              Редагувати пацієнта
                            </button>
                            <button
                              type="button"
                              className="btn-save-table green"
                              onClick={() => onSaveChanges(type)}
                              disabled={isThreeDaysOld(created_at)}
                            >
                              Зберегти зміни
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                </li>
              );
            }
          )}
          {totalPages > 1 && (
            <ReactPaginate
              previousLabel={<i className="bx bxs-chevron-left bx-md"></i>}
              nextLabel={<i className="bx bxs-chevron-right bx-md"></i>}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              containerClassName={"pagination-edit-reports"}
              subContainerClassName={"pagination-edit-reports-sub"}
              activeClassName={"active"}
              pageClassName={"page-item"}
            />
          )}
        </ul>
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
