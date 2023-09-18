//Todo якщо термін дії форми пройшов 3 дні то кнопка відправити та інпути будуть заблоковані

import { useState } from "react";
import axios from "../../api/axios";
import DatepickerComponent from "./Сalendar";

import "./SavedForms.css";

export const SavedForms = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [data, setData] = useState([]);
  
  const onDateChange = (start, end) => {
    console.log("Received start date in Parent:", start);
    console.log("Received end date in Parent:", end);

    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };


  //* ДЛЯ 
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);


  const onButtonClick = () => {
    if (selectedStartDate && selectedEndDate) {
      // Формирование URL
      const url = `/reports?skip=0&limit=20&&from_created_at=${selectedStartDate}&to_created_at=${selectedEndDate}`;

      // Выполнение запроса к API с использованием axios
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response.data);
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

  const onFormDataById = (item) => {
    setSelectedItem({ id: item.id, type: item.type });
    const url = `reports/${item.type}/${item.id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSelectedItemDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table:", error);
      });
    console.log(item.id);
    console.log(item.type);
  };

  const typeNames = {
    operating: "Операційна",
    anesthesiology: "Анестезіологія",
    resuscitation: "Реанімація",
    // добавьте другие типы здесь
  };

  //* ДЛЯ РЕДАГУВАННЯ ІНФОРМАЦІЇ

  return (
    <div className="container-saved-forms">
      <div className="calendar-saved-forms">
        <DatepickerComponent onDateChange={onDateChange} />
        <button
          type="button"
          className="btn-calendar"
          onClick={onButtonClick}
        >
          Знайти
        </button>
      </div>
      <div>
        <ul className="list-saved-forms">
          {data.map((item) => (
            <li
              key={`${item.id}-${item.type}`}
              className="item-saved-forms"
              onClick={() => onFormDataById(item)}
            >
              <div className="mini-form">
                <p>
                  <strong>Форма:</strong>{" "}
                  {typeNames[item.type] || item.type}
                </p>
                <p>
                  <strong>Пацієнт:</strong> {item.patient_full_name}
                </p>
                <p>
                  <strong>№:</strong> {item.history_number}
                </p>
                <p>
                  <strong>Дата створення: </strong>
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              {selectedItem &&
               selectedItem.id === item.id &&
               selectedItem.type === item.type &&
               selectedItemDetails && (
                  <table border="1">
                    <thead>
                      <tr>
                        <th colSpan="2">
                          Телефон: {selectedItemDetails.patient.phone}
                        </th>
                        <th colSpan="2">
                          Дата народження:{" "}
                          {selectedItemDetails.patient.birthday}
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2">
                          Вік: {selectedItemDetails.patient.age}
                        </th>
                        <th colSpan="2">
                          К-сть. діб:{" "}
                          {selectedItemDetails.preoperative_day.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="4">
                          <strong>Діагноз:</strong>{" "}
                          {selectedItemDetails.diagnosis.title}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <strong>Операція:</strong>{" "}
                          {selectedItemDetails.operation.title}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Назва</strong>
                        </td>
                        <td className="table-save-size">
                          <strong>К-сть</strong>
                        </td>
                        <td>
                          <strong>Тип</strong>
                        </td>
                        <td>
                          <strong>Примітки</strong>
                        </td>
                      </tr>
                      {selectedItemDetails.rows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.medicament.title}</td>
                          <td>{row.quantity_of_medicament}</td>
                          <td>{row.unit_of_measurement}</td>
                          <td>{row.notation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
