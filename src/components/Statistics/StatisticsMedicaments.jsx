import { useState, useEffect, useCallback } from "react";
import DatepickerComponent from "../EditReports/Сalendar";
import $api from "../../api/api";
import ReactPaginate from "react-paginate";

export const StatisticsMedicaments = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLimit, setSelectedLimit] = useState("20");

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

  //* К-СТЬ ЕЛЕМЕНТІВ НА СТОРІНЦІ

  const onReportValueLimit = (e) => {
    const newLimit = e.target.value; // Получаем выбранное значение
    setSelectedLimit(newLimit); // Обновляем выбранное значение в состоянии
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

    const url = `/medicaments/statistics/`;
    const options = {
      params: {
        page: 1,
        from_date: dateTenDaysAgo,
        to_date: currentDate,
        limit: 20,
      },
    };

    $api
      .get(url, options)
      .then((response) => {
        setData(response.data.medicaments);
        setTotalPages(response.data.total_pages);
        console.log("1 раз", response.data);
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
        from_date: selectedStartDate,
        to_date: selectedEndDate,
        limit: selectedLimit,
      };

      const params = Object.keys(initialParams)
        .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
        .reduce((obj, key) => {
          obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
          return obj;
        }, {});

      const queryString = new URLSearchParams(params).toString();

      const url = `/medicaments/statistics/?${queryString}`;
      console.log(url);

      $api
        .get(url)
        .then((response) => {
          console.log("Статистика", response.data);
          setData(response.data.medicaments);
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

  const fetchData = (url) => {
    $api.get(url).then((response) => {
      setData(response.data.medicaments);
      setTotalPages(response.data.total_pages);
    });
  };

  const handlePageChange = (page) => {
    const initialParams = {
      page: page,
      from_date: selectedStartDate,
      to_date: selectedEndDate,
      limit: selectedLimit,
    };

    const params = Object.keys(initialParams)
      .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
      .reduce((obj, key) => {
        obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
        return obj;
      }, {});

    const queryString = new URLSearchParams(params).toString();
    const url = `/medicaments/statistics/?${queryString}`;
    fetchData(url);
  };

  //* СКАЧАТЬ ФАЙЛ
  const downloadFile = () => {
    const url = `/medicaments/statistics/xlsx?from_date=${selectedStartDate}&to_date=${selectedEndDate}`;

    $api({
      url: url,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        const encodedFilename = contentDisposition.split("utf-8''")[1];
        const decodedFilename = decodeURI(encodedFilename);
        console.log(decodedFilename);

        console.log("c-d", contentDisposition);
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = decodedFilename || "downloadedFile.xlsx";
        downloadLink.click();
      })
      .catch((error) => {
        console.error("Ошибка при скачивании файла", error);
      });
  };

  return (
    <div className="st-med-container">
      <div className="st-med-sort-container">
        <DatepickerComponent
          onDateChange={onDateChange}
          startDate={thirtyDaysAgo}
          endDate={currentDate}
        />
        <div>
          <p>
            <strong>Елементів на сторінці</strong>
          </p>

          <select
            name=""
            id=""
            className="select-value-page-med"
            onChange={onReportValueLimit}
            defaultValue=""
          >
            <option value="">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
        <div className="create-report-st-med-cont">
          <button
            className="create-report-st-med-btn"
            type="button"
            onClick={downloadFile}
          >
            Завантажити файл
          </button>
        </div>
      </div>
      <div className="table-st-med">
        <table>
          <thead>
            <tr className="table-st-med-head">
              <th className="size-table-st-med">Назва</th>
              <th className="size-table-st-med1">Од. вим.</th>
              <th className="size-table-st-med2">Кількісь</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                const { title, unit_of_measurement, total_quantity } = item;
                return (
                  <tr key={index}>
                    <td>
                      <p className="table-st-med-title">{title}</p>
                    </td>
                    <td>
                      <p className="table-st-med-unit">{unit_of_measurement}</p>
                    </td>
                    <td>
                      <p className="table-st-med-total">{total_quantity}</p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3">Порожній список</td>
              </tr>
            )}
          </tbody>
        </table>
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
