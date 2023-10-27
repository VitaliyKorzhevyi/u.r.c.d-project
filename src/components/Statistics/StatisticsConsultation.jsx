import { useState, useEffect, useCallback } from "react";
import DatepickerComponent from "../EditReports/Сalendar";
import $api from "../../api/api";

export const StatisticsConsultation = () => {
  const [data, setData] = useState([]);

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
    const url = `/consultations/statistics`;
    const options = {
      params: {
        from_date: dateTenDaysAgo,
        to_date: currentDate,
      },
    };

    $api
      .get(url, options)
      .then((response) => {
        setData(response.data);
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
        from_date: selectedStartDate,
        to_date: selectedEndDate,
      };

      const params = Object.keys(initialParams)
        .filter((key) => initialParams[key]) // Отбираем только те ключи, значения которых заданы
        .reduce((obj, key) => {
          obj[key] = initialParams[key]; // Создаем новый объект с отобранными ключами
          return obj;
        }, {});

      const queryString = new URLSearchParams(params).toString();
      const url = `/consultations/statistics?${queryString}`;
      console.log(url);

      $api
        .get(url)
        .then((response) => {
          console.log("Статистика консультацій", response.data);
          setData(response.data);
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

  //* СКАЧАТЬ ФАЙЛ
  const downloadFile = () => {
    const url = `/consultations/statistics/xlsx?from_date=${selectedStartDate}&to_date=${selectedEndDate}`;
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

  const totalTotalConsultations = data.reduce(
    (sum, item) => sum + item.total_consultations,
    0
  );
  const totalFreeConsultations = data.reduce(
    (sum, item) => sum + item.free_consultations,
    0
  );
  const totalPaidConsultations = data.reduce(
    (sum, item) => sum + item.paid_consultations,
    0
  );
  const totalPaymentConsultations = data.reduce(
    (sum, item) => sum + item.payments_sum,
    0
  );


  return (
    <div className="st-med-container">
      <div className="st-med-sort-container">
        <DatepickerComponent
          onDateChange={onDateChange}
          startDate={thirtyDaysAgo}
          endDate={currentDate}
        />
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
            <tr className="table-st-cons-head">
              <th className="size-table-st-cons">№</th>
              <th className="size-table-st-cons1">П.І.Б. лікаря</th>
              <th className="size-table-st-cons2">К-сть. хворих</th>
              <th className="size-table-st-cons2">Безоплатні</th>
              <th className="size-table-st-cons2">Платні</th>
              <th className="">Сума</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                const {
                  user,
                  free_consultations,
                  total_consultations,
                  paid_consultations,
                  payments_sum,
                } = item;
                return (
                  <tr key={index} className="table-st-cons-data">
                    <td>
                      <p>{index + 1}</p>
                    </td>
                    <td>
                      <p>{user.full_name}</p>
                    </td>
                    <td>
                      <p>{total_consultations}</p>
                    </td>
                    <td>
                      <p>{free_consultations}</p>
                    </td>
                    <td>
                      <p>{paid_consultations}</p>
                    </td>
                    <td>
                      <p>{payments_sum}</p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">Порожній список</td>
              </tr>
            )}
            <tr className="table-st-cons-total">
              <td>Сума:</td>
              <td></td>
              <td>{totalTotalConsultations}</td>
              <td>{totalFreeConsultations}</td>
              <td>{totalPaidConsultations}</td>
              <td>{totalPaymentConsultations}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
