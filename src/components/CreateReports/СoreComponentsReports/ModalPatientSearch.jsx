//todo перевірити пошук за номером
import { useState, useEffect, useCallback } from "react";
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
}) => {
  const [patients, setPatients] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const MIN_LENGTH = 4;

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

  const fetchData = useCallback(async (params, nextPage = 1) => {
    if (!validateParams(params)) return;
    const queryString = createQueryString(params);
    console.log("Sending request with params:", queryString);
    if (!queryString) return;
    try {
      const response = await $api.get(
        `patients?page=${nextPage}&limit=20&${queryString}&sort=-id`
      );
      if (!response.data.patients.length) {
        toast.warn("Пацієнт не знайдений.");
      } else {
        setPatients(prevPatients => {
          const updatedPatients = [...prevPatients, ...response.data.patients];
          return updatedPatients.filter(
              (patient, index, self) =>
                  index === self.findIndex((p) => p.id === patient.id)
          );
      });
        console.log(response.data.patients);
      }
      return response;
    } catch (error) {
      console.error("Пошук не вдався", error);
      toast.error("Помилка під час пошуку. Будь ласка, спробуйте пізніше.");
    }
  }, [validateParams, createQueryString]);

  const handleScroll = useCallback(
    (e) => {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop ===
        e.target.clientHeight;
      if (bottom && !loadingMore) {
        setLoadingMore(true);
        setPage((prev) => prev + 1);
        fetchData(
          {
            last_name: lastName,
            first_name: firstName,
            middle_name: middleName,
            phone: phone,
            email: email,
            birthday: birthday,
          },
          page + 1
        ).finally(() => setLoadingMore(false));
      }
    },
    [loadingMore, lastName, firstName, middleName, phone, email, birthday, page, fetchData]
  );

  useEffect(() => {
    const listElem = document.querySelector(".patients-list");
    if (listElem) {
        listElem.addEventListener("scroll", handleScroll);
        return () => listElem.removeEventListener("scroll", handleScroll);
    }
}, [handleScroll]);

  if (!isOpen) return null;

  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthday("");
    setPhone("");
    setEmail("");
    setPatients([]);
  };

  if (!isOpen) return null;

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName,
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
                <img
          src="/images/cross.svg"
          alt="Х"
          className="logo-autorization"
        />
        </div>
        <p className="modal-search-title">Пошук пацієнта</p>

        <form onSubmit={onSearchPatient} className="modal-container">
          <div className="input-container">
            <label>
              <input
                value={lastName}
                placeholder="Прізвище"
                onChange={(e) => setLastName(capitalize(e.target.value))}
              />
            </label>
            <label>
              <input
                value={firstName}
                placeholder="Ім'я"
                onChange={(e) => setFirstName(capitalize(e.target.value))}
              />
            </label>
          </div>
          <div className="input-container">
            <label>
              <input
                value={middleName}
                placeholder="По батькові"
                onChange={(e) => setMiddleName(capitalize(e.target.value))}
              />
            </label>

            <label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label>
              <input
                value={email}
                placeholder="Пошта"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <input
                type="text"
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
        <div className="patients-list">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-item"
              onClick={() => onItemClick(patient)}
            >
              <ul className="patient-list-info">
                <li>
                  <p>
                    <strong>Ім'я:</strong> {patient.full_name}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>День народження:</strong> {patient.birthday}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Вік:</strong> {patient.age}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Телефон:</strong> {patient.phone}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Пошта:</strong> {patient.email}
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
