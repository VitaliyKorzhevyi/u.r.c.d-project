import { useState } from "react";
import $api from "../../api/api";
import DatepickerComponent from "../SavedForms/Сalendar";

import { ItemFormset } from "./ItemFormset";

import "./Pharmacy.css";

export const Pharmacy = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [data, setData] = useState([]);

  //* ДЛЯ ВИБОРУ ДАТИ
  const onDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  //* ДЛЯ ВІДОБРАЖЕННЯ СПИСКУ ТАБЛИЦІ
  const onButtonClick = () => {
    if (selectedStartDate && selectedEndDate) {
      const url = `/reports?skip=0&limit=99&&from_created_at=${selectedStartDate}&to_created_at=${selectedEndDate}`;

      $api
        .get(url)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      console.warn(
        "Please select both start and end dates before making a request."
      );
    }
  };

  return (
    <div className="container-pharmacy-forms">
      <div className="calendar-pharmacy-forms">
        <DatepickerComponent onDateChange={onDateChange} />
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
      </div>
      <div>
        <ItemFormset data={data} />
      </div>
    </div>
  );
};
