import { useState, useEffect } from "react";

import $api from "../../api/api";

import { DayInputFilter } from "./CoreComponentsFilter/DayInputFilter";
import { DiagnosesInputFilter } from "./CoreComponentsFilter/DiagnosesInputFilter";
import { OperatingInputFilter } from "./CoreComponentsFilter/OperatingInputFilter";
import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";

import "./ReportManagement.css";

export const ReportManagement = ({ userData, onFormDataChange }) => {
  const [formData, setFormData] = useState({
    preoperative_day_id: '',
    diagnosis_id: '',
    operation_id: '',
    patient_id: '',
    report_type: '',
    limit: '',
    history_number: '',
    sort: '',
  });
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);

  //* ЗАПИТ ДНІВ (передопераційна доба)
  const [days, setDays] = useState([]);

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

  // console.log("ред", userData);

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

  //* ТИП ЗВІТУ
  const onReportTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      report_type: e.target.value,
    }));
  };

  //* ТИП ЗВІТУ
  const onReportSortChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      sort: e.target.value,
    }));
  };

  //* К-СТЬ ЕЛЕМЕНТІВ НА СТОРІНЦІ

  const onReportValueLimit = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      limit: +e.target.value,
    }));
  };

  //* НОМЕР ІСТОРІЇ

  const onHistoryNumberChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      history_number: e.target.value, // используйте подходящее имя свойства для номера истории
    }));
  };

  return (
    <div className="management-container">
      <ul className="list-management-report">
        <li className="item-management-report">
          <p>
            <strong>К-сть. елементів на сторінці</strong>
          </p>

          <select
            name=""
            id=""
            className="select-value-page"
            onChange={onReportValueLimit}
            defaultValue=""
          >
            <option value=""></option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </li>
        <li className="item-management-report">
          <p>
            <strong>Тип звіту</strong>
          </p>
          <select
            name=""
            id=""
            className="select-value-type"
            onChange={onReportTypeChange}
            defaultValue=""
          >
            <option value=""></option>
            <option value="anesthesiology">Анестезіологія</option>
            <option value="operating">Операційна</option>
            <option value="resuscitation">Реанімація</option>
            <option value="surgery">Хірургія</option>
          </select>
        </li>
        <li className="item-management-report">
          <p>
            <strong>Сортувати за:</strong>
          </p>
          <select
            name=""
            id=""
            className="select-sort-reports"
            onChange={onReportSortChange}
            defaultValue=""
          >
            <option value=""></option>
            <option value="-created_at">Спочатку нові звіти</option>
            <option value="created_at">Спочатку старі звіти</option>
            <option value="updated_at">Останні оновлені</option>
            <option value="-updatedat">Давно не оновлювались</option>
          </select>
        </li>

        <li className="item-management-report">
          <p>
            <strong>Номер історії</strong>
          </p>
          <input
            type="text"
            className="input-size-filter"
            value={formData.history_number}
            onChange={onHistoryNumberChange}
          />
        </li>

        <li className="item-management-report">
          <p>
            <strong>К-сть. діб</strong>
          </p>
          <DayInputFilter items={days} onItemSelect={onDaySelect} />
        </li>

        <li className="item-management-report">
          <p>
            <strong>Діагноз</strong>
          </p>
          <DiagnosesInputFilter
            items={diagnoses}
            onItemSelect={onDiagnosesSelect}
          />
        </li>

        <li className="item-management-report">
          <p>
            <strong>Операція</strong>
          </p>
          <OperatingInputFilter
            items={operating}
            onItemSelect={onOperatingSelect}
          />
        </li>

        <li className="item-management-report">
          <div className="item-management-search-patient">
            <p>
              <strong>Пошук по пацієнту</strong>
            </p>
            <button
              type="button"
              className="btn-search-patient-filter"
              onClick={() => {
                toggleModalSearch();
              }}
            >
              <i className="bx bx-search bx-sm"></i>
            </button>
          </div>

          <p className="input-patient-fullname-filter">{patientFullName}</p>
        </li>
      </ul>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={onPatientSelect}
        onGetFullName={onSetPatientFullName}
      />
    </div>
  );
};
