import { useState } from "react";

import "./DataEditing.css";
 import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import { DataEditingPatient } from "./DataEditingPatient";


export const DataEditing = () => {

  //* ВИБІР ПАЦІЄНТА
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);
  const [patientData, setPatientData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    birthday: "",
    phone: "",
    email: ""
  });

  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
  };

  const onPatientSelect = (key, value) => {
    setPatientData(prevData => ({ ...prevData, [key]: value }));
  };

  return (
    <div className="container-data-editing">
      <div className="data-editing-patient">
        <h2 className="data-editing-title">Пацієнти</h2>
        <div className="data-editing-patient-container">
          <p>
            <strong>Пошук по пацієнту</strong>
          </p>
          <button
            type="button"
            className="btn-search-patient-filter"
            onClick={() => {
              toggleModalSearch();
            }}
          >
            <i className="bx bx-search bx-sm"></i>
          </button>
          <DataEditingPatient patientData={patientData}/>
        </div>
      </div>
      <div className="data-editing-medicament">
        <h2 className="data-editing-title">Медикаменти</h2>
      </div>
      <div className="data-editing-operation">
        <h2 className="data-editing-title">Операції</h2>
      </div>
      <div className="data-editing-diagnoses">
        <h2 className="data-editing-title">Діагнози</h2>
      </div>
      <div className="data-editing-preoperative-days">
        <h2 className="data-editing-title">Кількість днів</h2>
      </div>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={(id) => onPatientSelect("id", id)}
        onGetLastName={(lastName) => onPatientSelect("last_name", lastName)}
        onGetFirstName={(firstName) => onPatientSelect("first_name", firstName)}
        onGetMiddleName={(middleName) => onPatientSelect("middle_name", middleName)}
        onGetBirthday={(birthday) => onPatientSelect("birthday", birthday)}
        onGetPhone={(phone) => onPatientSelect("phone", phone)}
        onGetEmail={(email) => onPatientSelect("email", email)}
      />
    </div>
  );
};
