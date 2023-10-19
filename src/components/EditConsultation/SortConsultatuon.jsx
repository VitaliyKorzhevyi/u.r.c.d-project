import { useState, useEffect, useContext, useCallback } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";
import DatepickerComponent from "../EditReports/Сalendar";
import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import { ModalUserSearch } from "../ReportsManagement/CoreComponentsFilter/ModalUserSearch";

export const SortConsultatuon = ({ data, showUserSearchButton }) => {
  const { myData } = useContext(UserDataContext);
  const [currentFormData, setCurrentFormData] = useState({});
  const [formData, setFormData] = useState({
    receipt_number: "",
    patient_id: "",
    sort: "",
  });

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

  const onClearPatient = () => {
    setFormData((prevData) => ({
      ...prevData,
      patient_id: "",
    }));
    setPatientFullName(""); // Очистка имени пациента
  };


  //* ВИБІР ЮЗЕРА
  const [isModalOpenSearchUser, setModalOpenSearchUser] = useState(false);
  const [userFullName, setUserFullName] = useState("");

  const toggleModalSearchUser = () => {
    setModalOpenSearchUser(!isModalOpenSearchUser);
  };

  const onUserSelect = (selectedUserId) => {
    setFormData((prevData) => ({
      ...prevData,
      user_id: selectedUserId,
    }));
  };

  const onClearUser = () => {
    setFormData((prevData) => ({
      ...prevData,
      user_id: "",
    }));
    setUserFullName(""); // Очистка имени пациента
  };

  const onSetUserFullName = (fullName) => {
    setUserFullName(fullName);
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
    const url = `/consultations`;
    const options = {
      params: {
        from_created_at: dateTenDaysAgo,
        to_created_at: currentDate,
      },
    };

    if (!showUserSearchButton) {
      options.params.user_id = myData.id;
    }
  
    $api
      .get(url, options)
      .then((response) => {
        data(response.data.consultations);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
      });
  }, [getCurrentDate, getDateFromDaysAgo, myData.id, data, showUserSearchButton]);

  //* при натисканні на кнопку
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

      if (!showUserSearchButton) {
        initialParams.user_id = myData.id;
      }

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
      {showUserSearchButton && (
        <li>
          <div className="cons-sort-container-search">
            <p className="cons-sort-container-title">Пошук по лікарю</p>
            <div className="btns-maneg-patient-filter">
              <button
                type="button"
                className="btn-search-patient-filter"
                onClick={() => {
                  toggleModalSearchUser();
                }}
              >
                <i className="bx bx-search bx-sm"></i>
              </button>
              <button
                type="button"
                className="btn-clear-patient-filter"
                onClick={onClearUser}
              >
                <i className="bx bx-trash bx-sm"></i>
              </button>
            </div>
          </div>
          <p className="input-patient-fullname-filter">{userFullName}</p>
        </li>
      )}
      <li>
        <button type="button" className="btn-calendar" onClick={onButtonClick}>
          Знайти
        </button>
      </li>
      <ModalUserSearch
        isOpen={isModalOpenSearchUser}
        onClose={toggleModalSearchUser}
        onGetId={onUserSelect}
        onGetFullName={onSetUserFullName}
      />
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={onPatientSelect}
        onGetFullName={onSetPatientFullName}
      />
    </ul>
  );
};
