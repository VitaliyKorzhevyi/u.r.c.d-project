//todo перевірити пошук за номером
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import $api from "../../../api/api";
import "./ModalPatientSearch.css";

export const ModalPatientSearch = ({
  isOpen,
  onClose,
  onGetAge,
  onGetFullName,
  onGetBirthday,
  onGetId,
  onGetPhone,
  onGetLastName,
  onGetFirstName,
  onGetMiddleName,
  onGetEmail,
  onGetData,
  onShowBtnCreate,
}) => {
  const [patients, setPatients] = useState([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const listElemRef = useRef(null);

  const MIN_LENGTH = 2;
  //* Списки ПІБ
  const [filterFirstName, setFilterFirstName] = useState([]);
  const [filterLastName, setFilterLastName] = useState([]);
  const [filterMiddleName, setFilterMiddleName] = useState([]);

  const [inputValueLastName, setInputValueLastName] = useState("");
  const [inputValueFirstName, setInputValueFirstName] = useState("");
  const [inputValueMiddleName, setInputValueMiddleName] = useState("");

  const [isDropdownVisibleFirst, setIsDropdownVisibleFirst] = useState(false);
  const [isDropdownVisibleLast, setIsDropdownVisibleLast] = useState(false);
  const [isDropdownVisibleMiddle, setIsDropdownVisibleMiddle] = useState(false);

  useEffect(() => {
    $api
      .get("/patients/filters/first_name")
      .then((response) => setFilterFirstName(response.data));
  }, []);

  useEffect(() => {
    $api
      .get("/patients/filters/last_name")
      .then((response) => setFilterLastName(response.data));
  }, []);

  useEffect(() => {
    $api
      .get("/patients/filters/middle_name")
      .then((response) => setFilterMiddleName(response.data));
  }, []);

  const MIN_INPUT_LENGTH = 1;

  const onInputChangeLastName = (e) => {
    setInputValueLastName(e.target.value);
    setIsDropdownVisibleLast(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const onInputChangeFirstName = (e) => {
    setInputValueFirstName(e.target.value);
    setIsDropdownVisibleFirst(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  const onInputChangeMiddleName = (e) => {
    setInputValueMiddleName(e.target.value);
    setIsDropdownVisibleMiddle(e.target.value.length >= MIN_INPUT_LENGTH);
  };

  //*____________ВАЛІДАЦІЯ

  const validateParams = useCallback((params) => {
    for (let value of Object.values(params)) {
      if (value && value.length < MIN_LENGTH) {
        toast.warn(`Рядок повинен містити не менше ${MIN_LENGTH} символів!`);
        return false;
      }
    }
    return true;
  }, []);

  const createQueryString = useCallback((params) => {
    return Object.entries(params)
      .filter(([_, value]) => value && value.length >= MIN_LENGTH)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }, []);

  useEffect(() => {
    const handleScroll = async (e) => {
      const bottom =
      listElem.scrollHeight - listElem.scrollTop <= 2 * listElem.clientHeight;

      if (bottom && !loadingMore && currentPage < totalPage) {
        setLoadingMore(true);
      
        try {
          const params = {
            last_name: inputValueLastName,
            first_name: inputValueFirstName,
            middle_name: inputValueMiddleName,
            phone: phone,
            email: email,
            birthday: birthday,
          };

          if (!validateParams(params)) return;
          const queryString = createQueryString(params);

          if (!queryString) return;

          try {
            const response = await $api.get(
              `patients?page=${currentPage+1}&limit=20&${queryString}&sort=-id`
            );

            if (!response.data.patients.length) {
              toast.warn("Пацієнт не знайдений.");
            } else {
              setPatients((prevPatients) => {
                const newPatients = response.data.patients.filter(
                  (newPatient) =>
                    !prevPatients.some(
                      (prevPatient) => prevPatient.id === newPatient.id
                    )
                );
                return [...prevPatients, ...newPatients];
              });
              setCurrentPage(response.data.current_page)
              
            }

            console.log("Нові пацієнти", response.data);

            return response;
          } catch (error) {
            console.error("Пошук не вдався", error);
            toast.error(
              "Помилка під час пошуку. Будь ласка, спробуйте пізніше."
            );
          }
        } catch (error) {
          // Handle any errors thrown by fetchData
          console.error("Fetch data error", error);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    const listElem = listElemRef.current;
    if (listElem) {
      listElem.addEventListener("scroll", handleScroll);
      return () => listElem.removeEventListener("scroll", handleScroll);
    }
  }, [
    currentPage,
    totalPage,
    validateParams,
    createQueryString,
    inputValueLastName,
    inputValueFirstName,
    inputValueMiddleName,
    phone,
    email,
    birthday,
    loadingMore,
    setPatients,
  ]);

  const fetchData = async (params) => {
    if (!validateParams(params)) return;
    const queryString = createQueryString(params);
    if (!queryString) {
      setPatients([]);
      return;
    }
    try {
      const response = await $api.get(
        `patients?page=1&limit=20&${queryString}&sort=-id`
      );

      if (!response.data.patients.length) {
        toast.warn("Пациент не найден.");
        setPatients([]);
        onShowBtnCreate?.(true);
      } else {
        setPatients(response.data.patients);
        setTotalPage(response.data.total_pages);
        setCurrentPage(response.data.current_page)
        console.log(response.data.total_pages);
      }

      return response;
    } catch (error) {
      console.error("Поиск не удался", error);
      toast.error("Ошибка во время поиска. Пожалуйста, попробуйте позже.");
    }
  };

  if (!isOpen) return null;

  const resetFields = () => {
    setInputValueFirstName("");
    setInputValueLastName("");
    setInputValueMiddleName("");
    setBirthday("");
    setPhone("");
    setEmail("");
    setPatients([]);
  };

  if (!isOpen) return null;

  const onPhoneChange = (e) => {
    let phoneNumber = e.target.value.replace(/\+/g, "");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (phoneNumber.length > 15) {
      phoneNumber = phoneNumber.slice(3, 15);
    }
    setPhone(phoneNumber);
  };

  const onSearchPatient = (e) => {
    e.preventDefault();
    fetchData({
      last_name: inputValueLastName,
      first_name: inputValueFirstName,
      middle_name: inputValueMiddleName,
      phone: phone,
      email: email,
      birthday: birthday,
    });
  };

  const onItemClick = (patient) => {
    console.log("Selected patient:", patient);
    onGetFullName?.(patient.full_name);
    onGetAge?.(patient.age);

    onGetBirthday?.(patient.birthday);
    onGetId?.(patient.id);
    onGetPhone?.(patient.phone);
    onGetLastName?.(patient.last_name);
    onGetFirstName?.(patient.first_name);
    onGetMiddleName?.(patient.middle_name);
    onGetEmail?.(patient.email);
    onGetData?.(patient);

    resetFields();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          className="btn-close-modal"
          onClick={() => {
            resetFields();
            onClose();
          }}
        >
          <img src="/images/cross.svg" alt="Х" className="logo-autorization" />
        </div>
        <p className="modal-search-title">Пошук пацієнта</p>

        <form onSubmit={onSearchPatient} className="modal-container">
          <div className="input-container">
            <div className="container-full-name">
              <div>
                <input
                  id="medicament-edit"
                  type="text"
                  placeholder="Прізвище"
                  autoComplete="off"
                  title={inputValueLastName}
                  value={inputValueLastName}
                  onChange={onInputChangeLastName}
                />
              </div>
              {isDropdownVisibleLast && (
                <ul className="dropdown-full-name">
                  {filterLastName
                    .filter((item) =>
                      item
                        .toLowerCase()
                        .includes(inputValueLastName.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setInputValueLastName(item);
                          setIsDropdownVisibleLast(false);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <div className="container-full-name">
              <div>
                <input
                  id="medicament-edit"
                  type="text"
                  placeholder="Ім'я"
                  autoComplete="off"
                  title={inputValueFirstName}
                  value={inputValueFirstName}
                  onChange={onInputChangeFirstName}
                />
              </div>
              {isDropdownVisibleFirst && (
                <ul className="dropdown-full-name">
                  {filterFirstName
                    .filter((item) =>
                      item
                        .toLowerCase()
                        .includes(inputValueFirstName.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setInputValueFirstName(item);
                          setIsDropdownVisibleFirst(false);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          <div className="input-container">
            <div className="container-full-name">
              <div>
                <input
                  id="medicament-edit"
                  type="text"
                  placeholder="По-батькові"
                  autoComplete="off"
                  title={inputValueMiddleName}
                  value={inputValueMiddleName}
                  onChange={onInputChangeMiddleName}
                />
              </div>
              {isDropdownVisibleMiddle && (
                <ul className="dropdown-full-name">
                  {filterMiddleName
                    .filter((item) =>
                      item
                        .toLowerCase()
                        .includes(inputValueMiddleName.toLowerCase())
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setInputValueMiddleName(item);
                          setIsDropdownVisibleMiddle(false);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <label>
              <input
                autoComplete="off"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label>
              <input
                autoComplete="off"
                value={email}
                placeholder="Пошта"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <input
                type="text"
                autoComplete="off"
                placeholder="Телефон"
                value={phone}
                onChange={onPhoneChange}
              />
            </label>
          </div>
          <div>
            <button type="submit" className="btn-search">
              Пошук
            </button>
          </div>
        </form>
        <div className="patients-list" ref={listElemRef}>
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-item"
              onClick={() => onItemClick(patient)}
            >
              <ul className="patient-list-info">
                <li>
                  <p>
                    <strong>П.І.Б.:</strong> {patient.full_name}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>День народження:</strong>{" "}
                    {patient.birthday.split("-").reverse().join(".")}
                  </p>
                  <p>
                    <strong>Вік:</strong> {patient.age}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Телефон:</strong> {patient.phone || "немає"}
                  </p>
                  <p>
                    <strong>Пошта:</strong> {patient.email || "немає"}
                  </p>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
