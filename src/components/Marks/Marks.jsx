import { useState, useEffect, useCallback } from "react";
import $api from "../../api/api";
import DatepickerComponent from "../EditReports/Сalendar";
import ReactPaginate from "react-paginate";

import { ReportsManagement } from "../ReportsManagement/ReportsManagement";
import { ItemFormset } from "./ItemFormset";

import "./Marks.css";

export const Marks = ({ userData }) => {
  const [data, setData] = useState([]);
  const [currentFormData, setCurrentFormData] = useState({});

  const [totalPages, setTotalPages] = useState(0);

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

  const onFormDataChange = (newFormData) => {
    setCurrentFormData(newFormData);
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
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
      });
  }, [getCurrentDate, getDateFromDaysAgo]);

  //* ДЛЯ ВІДОБРАЖЕННЯ СПИСКУ ТАБЛИЦІ
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
      .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
      .reduce((obj, key) => {
        obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
        return obj;
      }, {});

    const queryString = new URLSearchParams(params).toString();
    const url = `/reports?${queryString}`;
    fetchData(url);
  };

  return (
    <div className="container-marks-forms">
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
            onFormDataChange={onFormDataChange}
            showUserSearchButton={true}
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
      <div className="container-marks-forms-size">
        <ItemFormset data={data} userData={userData} />

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
      </div>
    </div>
  );
};
