import { useState, useEffect } from "react";
import $api from "../../api/api";
import DatepickerComponent from "../EditReports/Сalendar";
import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";

export const SortConsultatuon = ({ data }) => {
  const [currentFormData, setCurrentFormData] = useState({});
  const [formData, setFormData] = useState({
    receipt_number: "",
    patient_id: "",
    sort: "",
  });

  const onClearPatient = () => {
    setFormData((prevData) => ({
      ...prevData,
      patient_id: "",
    }));
    setPatientFullName(""); // Очистка имени пациента
  };

  //* ДЛЯ ВИБОРУ ДАТИ
  const formatDateDefoult = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  //* ВИБІР ПАЦІЄНТА
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);
  const [patientFullName, setPatientFullName] = useState("");

  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
  };

  const onPatientSelect = (selectedPatientId) => {
    setFormData((prevData) => ({
      ...prevData,
      patient_id: selectedPatientId,
    }));
  };

  const onSetPatientFullName = (fullName) => {
    setPatientFullName(fullName);
  };

  //* СОРТ ЗВІТУ
  const onReportSortChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      sort: e.target.value,
    }));
  };

  const onHistoryNumberChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      receipt_number: e.target.value, // используйте подходящее имя свойства для номера истории
    }));
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

  const onFormDataChange = (newFormData) => {
    setCurrentFormData(newFormData);
  };

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData]);

  const onButtonClick = () => {
    if (selectedStartDate && selectedEndDate) {
      const initialParams = {
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
      const url = `/consultations?${queryString}`;
      console.log(url);

      $api
        .get(url)
        .then((response) => {
          data(response.data.consultations);
          console.log("from server:", response.data);
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
  return (
    <ul className="cons-sort-container">
      <li>
        <DatepickerComponent
          onDateChange={onDateChange}
          startDate={thirtyDaysAgo}
          endDate={currentDate}
        />
      </li>
      <li>
        <p className="cons-sort-container-title">Сортувати за:</p>
        <select className="select-sort-new-cons" onChange={onReportSortChange}>
          <option value="-created_at">Спочатку нові звіти</option>
          <option value="created_at">Спочатку старі звіти</option>
        </select>
      </li>
      <li>
        <p className="cons-sort-container-title">Номер талону квитанції</p>
        <input
          type="text"
          autoComplete="off"
          className="input-size-filter"
          value={formData.history_number}
          onChange={onHistoryNumberChange}
        />
      </li>
      <li>
        <div className="cons-sort-container-search">
          <p className="cons-sort-container-title">Пошук по пацієнту</p>
          <div className="btns-maneg-patient-filter">
            <button
              type="button"
              className="btn-search-patient-filter"
              onClick={() => {
                toggleModalSearch();
              }}
            >
              <i className="bx bx-search bx-sm"></i>
            </button>
            <button
              type="button"
              className="btn-clear-patient-filter"
              onClick={onClearPatient}
            >
              <i className="bx bx-trash bx-sm"></i>
            </button>
          </div>
        </div>
        <p className="input-patient-fullname-filter">{patientFullName}</p>
      </li>
      <li>
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
      </li>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={onPatientSelect}
        onGetFullName={onSetPatientFullName}
      />
    </ul>
  );
};
