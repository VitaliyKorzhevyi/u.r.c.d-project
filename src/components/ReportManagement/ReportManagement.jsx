import { useState, useEffect } from "react";

import $api from "../../api/api";

import { DayInputFilter } from "./CoreComponentsFilter/DayInputFilter";
import { DiagnosesInputFilter } from "./CoreComponentsFilter/DiagnosesInputFilter";
import { OperatingInputFilter } from "./CoreComponentsFilter/OperatingInputFilter";

import "./ReportManagement.css";

export const ReportManagement = ({ userData }) => {
  //* ЗАПИТ ДНІВ (передопераційна доба)
  const [days, setDays] = useState([]);

  useEffect(() => {
    $api.get("/preoperative-days").then((response) => {
      console.log("Доба:", response.data);
      setDays(response.data);
    });
  }, []);

  const onDaySelect = (selectedDayId) => {
    console.log("День", selectedDayId);
  };

  //* ЗАПИТ ДІАГНОЗІВ
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    $api.get("/diagnoses").then((response) => setDiagnoses(response.data));
  }, []);

  const onDiagnosesSelect = (selectedDiagnosesId) => {
    console.log("Діагноз", selectedDiagnosesId);
  };

  //* ЗАПИТ ОПЕРАЦІЙ
  const [operating, setOperating] = useState([]);

  useEffect(() => {
    $api.get("/operations").then((response) => setOperating(response.data));
  }, []);

  const onOperatingSelect = (selectedOperatingId) => {
    console.log("Операція", selectedOperatingId);
  };

  console.log("ред", userData);

  return (
    <div className="management-container">
      <ul className="list-management-report">
        <li className="item-management-report">
          <p>
            <strong>К-сть. елементів на сторніці</strong>
          </p>
          <select name="" id="" className="select-value-page">
            <option value="">30</option>
            <option value="">50</option>
            <option value="">100</option>
          </select>
        </li>
        <li className="item-management-report">
          <p>
            <strong>Тип звіту</strong>
          </p>
          <select name="" id="" className="select-value-type">
            <option value="">Анестезіологія</option>
            <option value="">Операційна</option>
            <option value="">Реанімація</option>
            <option value="">Хірургія</option>
          </select>
        </li>
        <li className="item-management-report">
          <p>
            <strong>Сортувати за:</strong>
          </p>
          <select name="" id="" className="select-sort-reports">
            <option value="">Спочатку нові звіти</option>
            <option value="">Спочатку старі звіти</option>
            <option value="">Останні оновлені</option>
            <option value="">Давно не оновлювались</option>
          </select>
        </li>

        <li className="item-management-report">
          <p>
            <strong>Номер історії</strong>
          </p>
          <input type="text" />
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
          <p>
            <strong>Пошук по пацієнту</strong>
          </p>
          <button type="button">+</button>
        </li>
      </ul>
    </div>
  );
};
