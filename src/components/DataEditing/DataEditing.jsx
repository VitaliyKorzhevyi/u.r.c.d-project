import { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../../pages/HomePage";
import $api from "../../api/api";
import { toast } from "react-toastify";

import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import { DataEditingPatient } from "./DataEditingPatient";
import { DataEditingInputs } from "./DataEditingInputs";

import "./DataEditing.css";

export const DataEditing = () => {
  const { myData } = useContext(UserDataContext);

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

  const canAccessMedicaments = myData.permissions.includes(
    "edit_medicament"
  );
  const canAccessDiagnoses = myData.permissions.includes("edit_diagnosis");
  const canAccessOperations = myData.permissions.includes("edit_operation");
  const canAccessDays = myData.permissions.includes("edit_preoperative_day");
  const showEditingContainerItems =
    canAccessMedicaments ||
    canAccessDiagnoses ||
    canAccessOperations ||
    canAccessDays;

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
        if (updatedItem === medicamentItem) {
          refreshMedicaments();
        }
        if (updatedItem === diagnosesItem) {
          refreshDiagnoses();
        }
        if (updatedItem === operationsItem) {
          refreshOperations();
        }
        if (updatedItem === daysItem) {
          refreshDays();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const refreshMedicaments = () => {
    $api.get("/medicaments").then((response) => setMedicaments(response.data));
  };

  const refreshDiagnoses = () => {
    $api.get("/diagnoses").then((response) => setDiagnoses(response.data));
  };

  const refreshOperations = () => {
    $api.get("/operations").then((response) => setOperations(response.data));
  };

  const refreshDays = () => {
    $api.get("/preoperative-days").then((response) => setDays(response.data));
  };

  useEffect(() => {
    if (canAccessMedicaments) {
      $api.get("/medicaments").then((response) => {
        setMedicaments(response.data);
        console.log("ПРАЦЮЄ", response.data);
      });
    }
  }, [canAccessMedicaments]);

  useEffect(() => {
    if (canAccessDiagnoses) {
      $api.get("/diagnoses").then((response) => setDiagnoses(response.data));
    }
  }, [canAccessDiagnoses]);

  useEffect(() => {
    if (canAccessOperations) {
      $api.get("/operations").then((response) => setOperations(response.data));
    }
  }, [canAccessOperations]);

  useEffect(() => {
    if (canAccessDays) {
      $api.get("/preoperative-days").then((response) => setDays(response.data));
    }
  }, [canAccessDays]);

  //* ПОШУК ТА РЕДАГУВННЯ МЕДИКАМЕНТІВ
  const [medicaments, setMedicaments] = useState([]);
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

  //* ПОШУК ТА РЕДАГУВАННЯ ДІАГНОЗІВ
  const [diagnoses, setDiagnoses] = useState([]);
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

  //* Додавання нових данних у списки

  const updateData = ({ data, config }) => {
    if (config.url === "./medicaments") {
      setMedicaments((pS) => [...pS, data]);
    }

    if (config.url === "./diagnoses") {
      setDiagnoses((pS) => [...pS, data]);
    }

    if (config.url === "./operations") {
      setOperations((pS) => [...pS, data]);
    }

    if (config.url === "./preoperative-days") {
      setDays((pS) => [...pS, data]);
    }
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
      {showEditingContainerItems && (
        <div className="editing-container-items">
          <div className="editing-semi-container">
            <h2 className="data-editing-title">Медикаменти</h2>
            <div className="editing-item-inputs">
              <DataEditingInputs
                items={medicaments}
                selectedItem={medicamentItem}
                onItemSelect={onMedicamentSelect}
                urlSelect="./medicaments"
                msgSuccess="Медикамент"
                updateData={updateData}
              />
              <div>
                <label htmlFor="edit-medicaments">Редагування:&nbsp;</label>
                <input
                  id="edit-medicaments"
                  type="text"
                  autoComplete="off"
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
                urlSelect="./diagnoses"
                msgSuccess="Діагноз"
                updateData={updateData}
              />
              <div>
                <label htmlFor="edit-diagnoses">Редагування:&nbsp;</label>
                <input
                  id="edit-diagnoses"
                  type="text"
                  autoComplete="off"
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
                urlSelect="./operations"
                msgSuccess="Операція"
                updateData={updateData}
              />
              <div>
                <label htmlFor="edit-operations">Редагування:&nbsp;</label>
                <input
                  id="edit-operations"
                  type="text"
                  autoComplete="off"
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
                urlSelect="./preoperative-days"
                msgSuccess="К-сть. днів"
                updateData={updateData}
              />
              <div>
                <label htmlFor="edit-days">Редагування:&nbsp;</label>
                <input
                  id="edit-days"
                  type="text"
                  autoComplete="off"
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
      )}

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
