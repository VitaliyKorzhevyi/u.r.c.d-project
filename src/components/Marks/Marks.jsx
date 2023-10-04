import { useState } from "react";
import $api from "../../api/api";
import DatepickerComponent from "../EditReports/Сalendar";

import { ItemFormset } from "./ItemFormset";

import "./Marks.css";

export const Marks = ({userData}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //* ДЛЯ ВИБОРУ ДАТИ
  const onDateChange = (start, end) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  //* ДЛЯ ВІДОБРАЖЕННЯ СПИСКУ ТАБЛИЦІ
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
          console.error("Error fetching data:", error);
        });
    } else {
      console.warn(
        "Please select both start and end dates before making a request."
      );
    }
  };

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

  return (
    <div className="container-marks-forms">
      <div className="calendar-marks-forms">
        <DatepickerComponent onDateChange={onDateChange} />
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
      </div>
      <div>
        <ItemFormset data={data} userData={userData}/>
      </div>
      <div className="pagination">
        {totalPages > 1 && Array.from({ length: totalPages }).map((_, index) => (
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
  );
};
