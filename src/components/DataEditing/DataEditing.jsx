import { useState, useEffect } from "react";
import $api from "../../api/api";
import { toast } from "react-toastify";

import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import { DataEditingPatient } from "./DataEditingPatient";
import { DataEditingInputs } from "./DataEditingInputs";

import "./DataEditing.css";

export const DataEditing = () => {
  //* ВИБІР ПАЦІЄНТА
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);
  const [patientData, setPatientData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    birthday: "",
    phone: "",
    email: "",
  });

  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
  };

  const onPatientSelect = (key, value) => {
    setPatientData((prevData) => ({ ...prevData, [key]: value }));
  };

  //* СПІЛЬНИЙ ЗАПИТ НА РЕДАГУВАННЯ

  const onEditItem = (url, updatedItem, successMessage, setStateCallback) => {
    $api
      .put(url, updatedItem)
      .then((response) => {
        console.log(response);
        toast.success(successMessage, {
          autoClose: 1000,
        });
        setTimeout(() => {
          setStateCallback("");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //* ПОШУК ТА РЕДАГУВННЯ МЕДИКАМЕНТІВ
  const [medicaments, setMedicaments] = useState([]);

  useEffect(() => {
    $api.get("/medicaments").then((response) => setMedicaments(response.data));
  }, []);

  const [medicamentItem, setMedicamentsItem] = useState([]);
  const [medicamentsId, setMedicamentsId] = useState([]);

  const onMedicamentSelect = (id) => {
    const selectedMedicament = medicaments.find((item) => item.id === id);
    if (selectedMedicament) {
      setMedicamentsItem(selectedMedicament.title);
      setMedicamentsId(id);
    }
  };

  const onEditMedicament = () => {
    const URL = `/medicaments/${medicamentsId}`;
    onEditItem(
      URL,
      medicamentItem,
      "Медикамент відредаговано",
      setMedicamentsItem
    );
  };

  //* ПОШУК ТА РЕДАГУВННЯ ДІАГНОЗІВ
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    $api.get("/diagnoses").then((response) => setDiagnoses(response.data));
  }, []);

  const [diagnosesItem, setDiagnosesItem] = useState([]);
  const [diagnosesId, setDiagnosesId] = useState([]);

  const onDiagnosesSelect = (id) => {
    const selectedDiagnoses = diagnoses.find((item) => item.id === id);
    if (selectedDiagnoses) {
      setDiagnosesItem(selectedDiagnoses.title);
      setDiagnosesId(id);
    }
  };

  const onEditDiagnoses = () => {
    const URL = `/diagnoses/${diagnosesId}`;
    onEditItem(URL, diagnosesItem, "Діагноз відредаговано", setDiagnosesItem);
  };

  //* ПОШУК ТА РЕДАГУВАННЯ ОПЕРАЦІЙ
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    $api.get("/operations").then((response) => setOperations(response.data));
  }, []);

  const [operationsItem, setOperationsItem] = useState([]);
  const [operationsId, setOperationsId] = useState([]);

  const onOperationsSelect = (id) => {
    const selectedOperations = operations.find((item) => item.id === id);
    if (selectedOperations) {
      setOperationsItem(selectedOperations.title);
      setOperationsId(id);
    }
  };

  const onEditOperations = () => {
    const URL = `/operations/${operationsId}`;
    onEditItem(
      URL,
      operationsItem,
      "Операцію відредаговано",
      setOperationsItem
    );
  };

  //* ПОШУК ТА РЕДАГУВННЯ ДНІВ
  const [days, setDays] = useState([]);

  useEffect(() => {
    $api.get("/preoperative-days").then((response) => setDays(response.data));
  }, []);

  const [daysItem, setDaysItem] = useState([]);
  const [daysId, setDaysId] = useState([]);

  const onDaysSelect = (id) => {
    const selectedDays = days.find((item) => item.id === id);
    if (selectedDays) {
      setDaysItem(selectedDays.title);
      setDaysId(id);
    }
  };
  const onEditDays = () => {
    const URL = `/preoperative-days/${daysId}`;
    onEditItem(URL, daysItem, "К-сть. днів відредаговано", setDaysItem);
  };

  return (
    <div className="container-data-editing">
      <div className="data-editing-patient">
        <h2 className="data-editing-title-patient">Пацієнти</h2>
        <div className="data-editing-patient-container">
          <div className="data-editing-patient-semi-container">
            <p className="data-editing-patient-title">
              <strong>Пошук по пацієнту:</strong>
            </p>
            <button
              type="button"
              className="btn-data-editing-patient"
              onClick={toggleModalSearch}
            >
              <i className="bx bx-search bx-sm"></i>
            </button>
          </div>

          <DataEditingPatient patientData={patientData} />
        </div>
      </div>
      <div className="editing-container-items">
        <div className="editing-semi-container">
          <h2 className="data-editing-title">Медикаменти</h2>
          <div className="editing-item-inputs">
            <DataEditingInputs
              items={medicaments}
              selectedItem={medicamentItem}
              onItemSelect={onMedicamentSelect}
            />
            <div>
              <label htmlFor="edit-medicaments">Редагування:&nbsp;</label>
              <input
                id="edit-medicaments"
                type="text"
                value={medicamentItem}
                onChange={(e) => setMedicamentsItem(e.target.value)}
              />
              <button
                type="button"
                className="btn-editing-data-item"
                onClick={onEditMedicament}
              >
                Редагувати
              </button>
            </div>
          </div>
        </div>

        <div className="editing-semi-container">
          <h2 className="data-editing-title">Діагнози</h2>
          <div className="editing-item-inputs">
            <DataEditingInputs
              items={diagnoses}
              selectedItem={diagnosesItem}
              onItemSelect={onDiagnosesSelect}
            />
            <div>
              <label htmlFor="edit-diagnoses">Редагування:&nbsp;</label>
              <input
                id="edit-diagnoses"
                type="text"
                value={diagnosesItem}
                onChange={(e) => setDiagnosesItem(e.target.value)}
              />
              <button
                type="button"
                className="btn-editing-data-item"
                onClick={onEditDiagnoses}
              >
                Редагувати
              </button>
            </div>
          </div>
        </div>

        <div className="editing-semi-container">
          <h2 className="data-editing-title">Операції</h2>
          <div className="editing-item-inputs">
            <DataEditingInputs
              items={operations}
              selectedItem={operationsItem}
              onItemSelect={onOperationsSelect}
            />
            <div>
              <label htmlFor="edit-operations">Редагування:&nbsp;</label>
              <input
                id="edit-operations"
                type="text"
                value={operationsItem}
                onChange={(e) => setOperationsItem(e.target.value)}
              />
              <button
                type="button"
                className="btn-editing-data-item"
                onClick={onEditOperations}
              >
                Редагувати
              </button>
            </div>
          </div>
        </div>

        <div className="editing-semi-container">
          <h2 className="data-editing-title">Кількість днів</h2>
          <div className="editing-item-inputs">
            <DataEditingInputs
              items={days}
              selectedItem={daysItem}
              onItemSelect={onDaysSelect}
            />
            <div>
              <label htmlFor="edit-days">Редагування:&nbsp;</label>
              <input
                id="edit-days"
                type="text"
                value={daysItem}
                onChange={(e) => setDaysItem(e.target.value)}
              />
              <button
                type="button"
                className="btn-editing-data-item"
                onClick={onEditDays}
              >
                Редагувати
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetId={(id) => onPatientSelect("id", id)}
        onGetLastName={(lastName) => onPatientSelect("last_name", lastName)}
        onGetFirstName={(firstName) => onPatientSelect("first_name", firstName)}
        onGetMiddleName={(middleName) =>
          onPatientSelect("middle_name", middleName)
        }
        onGetBirthday={(birthday) => onPatientSelect("birthday", birthday)}
        onGetPhone={(phone) => onPatientSelect("phone", phone)}
        onGetEmail={(email) => onPatientSelect("email", email)}
      />
    </div>
  );
};
