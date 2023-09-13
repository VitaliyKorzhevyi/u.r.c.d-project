//Todo бібліотека дати!!!!!
//Todo додати валідацію на інпут доба
//Todo додати модалку для збереження форми

import { useState, useEffect } from "react";
import "./FormAnesthesiology.css";

import $api from "../../api/api";

import { ModalPatientCreate } from "./ModalWindows/ModalPatientCreate";
import { ModalPatientSearch } from "./ModalWindows/ModalPatientSearch";
import { MedicamentInput } from "./AnesthFormComponents/MedicamentInput";
import { DayInput } from "./AnesthFormComponents/DayInput";
import { DiagnosesInput } from "./AnesthFormComponents/DiagnosesInput";
import { OperationsInput } from "./AnesthFormComponents/OperationsInput";

import { QuantityInput } from "./AnesthFormComponents/QuantityInput";
import { TypeSelect } from "./AnesthFormComponents/TypeSelect";
import { NotesInput } from "./AnesthFormComponents/NotesInput";

import { CopyRowButton } from "./AnesthFormComponents/CopyRowButton";
import { DeleteRowButton } from "./AnesthFormComponents/DeleteRowButton";

export const FormAnesthesiology = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [myData, setmyData] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [days, setDays] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);
  

  //* ЗАПИТ НА ВСІХ ЮЗЕРІВ
  useEffect(() => {
    $api.get("/users/me/").then((response) => {
      console.log(response.data);
      setmyData(response.data);
    });
  }, []);


  //* ДЛЯ ЗБЕРЕЖЕННЯ МЕДИКАМЕНТІВ В СТЕЙТ
  const updateMedicaments = (newMedicament) => {
    setMedicaments((prevMedicaments) => [...prevMedicaments, newMedicament]);
  };

  useEffect(() => {
    $api.get("/medicaments").then((response) => {
      console.log(response.data);
      setMedicaments(response.data);
    });
  }, []);


  //* ДЛЯ ЗАПИТ ДНІВ (передопераційна доба)
  const updateDays = (newDay) => {
    setDays((prevDays) => [...prevDays, newDay]);
  };

  useEffect(() => {
    $api.get("/preoperative-days").then((response) => {
      console.log(response.data);
      setDays(response.data);
    });
  }, []);


  //* ЗАПИТ ДІАГНОЗІВ
  const updateDiagnoses = (newDiagnoses) => {
    setDiagnoses((prevDiagnoses) => [...prevDiagnoses, newDiagnoses]);
  };

  useEffect(() => {
    $api.get("/diagnoses").then((response) => {
      console.log(response.data);
      setDiagnoses(response.data);
    });
  }, []);


  //* ЗАПИТ ОПЕРАЦІЙ
  const updateOperations = (newOperations) => {
    setOperations((prevOperations) => [...prevOperations, newOperations]);
  };

  useEffect(() => {
    $api.get("/operations").then((response) => {
      console.log(response.data);
      setOperations(response.data);
    });
  }, []);

  //* МОДАЛЬНІ ВІКНА ДЛЯ СТВОРЕННЯ ТА ПОШУКУ ПАЦІЄНТА
  const toggleModalCreate = () => {
    setModalOpenCreate(!isModalOpenCreate);
    if (isModalOpenCreate) {
      setActiveFormIndex(null);
    }
  };


  const toggleModalSearch = () => {
    setModalOpenSearch(!isModalOpenSearch);
    if (isModalOpenSearch) {
      setActiveFormIndex(null);
    }
  };

  //* ЗБЕРЕЖЕННЯ ДАННИХ З ФОРМ У ЛОКАЛЬНЕ СХОВИЩЕ
  const savedForms = localStorage.getItem("anesthesiologyForms");
  const initialForms = savedForms
    ? JSON.parse(savedForms)
    : [
        {
          id: 0,
          locked: false,
          rows: [
            {
              medicament_id: "0",
              medicaments: "",
              quantity_of_medicament: 0,
              unit_of_measurement: "шт",
              notation: "",
            },
          ],
          doctorName: myData.full_name || "", // Додаткові поля
          date: "",
          birthday: "",
          history_number: "0",
          patient_id: "0",
          preoperative_day_id: "0",
          operation_id: "0",
          diagnisis_id: "0",
          patientName: "",
          age: "",
          diagnoses: "",
          operations: "",
          day: "",
        },
      ];

  const [forms, setForms] = useState(initialForms);
  const [nextFormId, setNextFormId] = useState(forms.length);

  //* ДОДАВАННЯ НОВИХ ФОРМ
  const onAddNewForm = () => {
    const newForm = {
      id: nextFormId,
      locked: false,
      rows: [
        {
          medicament_id: "0",
          medicaments: "",
          quantity_of_medicament: 0,
          unit_of_measurement: "шт",
          notation: "",
        },
      ],
      doctorName: myData.full_name || "",
      date: "",
      birthday: "",
      history_number: "0",
      patientName: "",
      age: "",
      diagnoses: "",
      operations: "",
      day: "",
    };
    setNextFormId(nextFormId + 1);
    const newForms = [...forms, newForm];
    setFormsWithStorage(newForms);
  };

  const onFieldChange = (formIndex, fieldName, value) => {
    const updatedForms = [...forms];
    updatedForms[formIndex][fieldName] = value;
    setFormsWithStorage(updatedForms);
  };

  const setFormsWithStorage = (newForms) => {
    localStorage.setItem("anesthesiologyForms", JSON.stringify(newForms));
    setForms(newForms);
  };

  useEffect(() => {
    const savedForms = localStorage.getItem("anesthesiologyForms");
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  //* УПРАВЛІННЯ ТАБЛИЦЕЮ

  // блок формИ
  const onLockForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].locked = !updatedForms[formIndex].locked;
    setFormsWithStorage(updatedForms);
  };

  // видалення форми
  const onDeleteForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms.splice(formIndex, 1);
    setFormsWithStorage(updatedForms);
  };

  // копіювання форми
  const onCopyForm = (formIndex) => {
    const formToCopy = forms[formIndex];
    const copiedForm = { ...formToCopy, id: nextFormId }; // используйте nextFormId здесь
    setNextFormId(nextFormId + 1); // установите новый ID
    const updatedForms = [...forms, copiedForm];
    setFormsWithStorage(updatedForms);
  };

  // додавання у форму нової строки
  const onAddRow = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows.push({
      medicament_id: "0",
      medicaments: "",
      quantity_of_medicament: 0,
      unit_of_measurement: "шт",
      notation: "",
    });
    setFormsWithStorage(updatedForms); // Обновление localStorage
  };


  //* ВІДОБРАЖЕННЯ ДАТИ
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const currentDate = getCurrentDate();

  //* ВІДПРАВКА ТАБЛИЦІ НА БЕК

  const convertFormToSend = (form) => {
    const sanitizeValue = (value) => {
      if (value === "" || (typeof value === "string" && value.length < 3)) {
        return null;
      }
      return value;
    };
    return {
      history_number: form.history_number,
      patient_id: form.patient_id,
      diagnosis_id: form.diagnosis_id,
      operation_id: form.operation_id,
      preoperative_day_id: form.preoperative_day_id,
      rows: form.rows.map((row) => ({
        medicament_id: row.medicament_id,
        quantity_of_medicament: row.quantity_of_medicament,
        unit_of_measurement: row.unit_of_measurement,
        notation: sanitizeValue(row.notation),
      })),
    };
  };

  const handleSaveForm = (formIndex) => {
    const currentForm = forms[formIndex];
    const dataToSend = convertFormToSend(currentForm);
    console.log(dataToSend);

    $api
      .post("/reports/anesthesiology", dataToSend)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {forms.map((form, formIndex) => (
        <div
          className={`form2-table ${form.locked ? "locked" : ""}`}
          key={form.id}
        >
          <div className="form2-icons">
            <i
              className={`bx bx-lock-open-alt bx-sm form1-icon ${
                form.locked ? "locked" : ""
              }`}
              onClick={() => onLockForm(formIndex)}
            ></i>
            <i
              className="bx bx-copy bx-sm form1-copy"
              onClick={() => onCopyForm(formIndex)}
            ></i>
            <i
              className="bx bx-trash bx-sm form1-delete"
              onClick={() => onDeleteForm(formIndex)}
            ></i>
          </div>
          <table>
            <thead>
              <tr>
                <th colSpan="7" className="form2-table-title">
                  АНЕСТЕЗІОЛОГІЯ
                </th>
              </tr>
            </thead>
            <tbody className="tbody2">
              <tr>
                <td colSpan="7">
                  <p className="form-table-name-user">
                    {myData.full_name} ({myData.job_title})
                  </p>
                </td>
              </tr>
              <tr>
                <td className="form2-table-size2">
                  <p className="form2-table-column1-text">Дата:</p>
                </td>

                <td id="date1" className="form2-table-time" colSpan="3">
                  {currentDate}
                </td>

                <td className="form2-table-size1">
                  <p className="form2-table-column1-text">№ історії:</p>
                </td>

                <td className="form2-table-size">
                  <input
                    type="number"
                    name="history_number"
                    className="form1-table-number"
                    value={form.history_number}
                    onChange={(e) =>
                      onFieldChange(formIndex, "history_number", e.target.value)
                    }
                    disabled={form.locked}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p className="form2-table-column1-text">Хворий:</p>
                </td>
                <td colSpan="2">
                  <p className="form2-table-time">{form.patientName}</p>
                </td>
                <td className="form-patient form2-table-time form2-table-size5">
                  <div className="btns-patient">
                    <button
                      type="button"
                      className="btn-patient blue one"
                      onClick={() => {
                        setActiveFormIndex(formIndex);
                        toggleModalSearch();
                      }}
                      disabled={form.locked}
                    >
                      <i className="bx bx-search bx-sm"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-patient green"
                      onClick={() => {
                        setActiveFormIndex(formIndex);
                        toggleModalCreate();
                      }}
                      disabled={form.locked}
                    >
                      <i className="bx bx-plus bx-sm"></i>
                    </button>
                  </div>
                </td>

                <td>
                  <p className="form2-table-column1-text ">Вік:</p>
                </td>

                <td>
                  <p className="form2-table-time">{form.age}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="form2-table-column1-text">Діагноз:</p>
                </td>
                <td colSpan="3">
                  <DiagnosesInput
                    diagnoses={diagnoses}
                    updateDiagnoses={updateDiagnoses}
                    formIndex={formIndex}
                    value={form.diagnoses}
                    locked={form.locked}
                    forms={forms}
                    setForms={setForms}
                    onDiagnosesId={(diagnosis_id) =>
                      onFieldChange(formIndex, "diagnosis_id", diagnosis_id)
                    }
                  />
                </td>
                <td>
                  <p className="form2-table-column1-text">Дата народження:</p>
                </td>
                <td>
                  <p className="form2-table-time">{form.birthday}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="form2-table-column1-text">Операція:</p>
                </td>
                <td colSpan="3">
                  <OperationsInput
                    operations={operations}
                    updateOperations={updateOperations}
                    formIndex={formIndex}
                    value={form.operations}
                    locked={form.locked}
                    forms={forms}
                    setForms={setForms}
                    onOperationId={(operation_id) =>
                      onFieldChange(formIndex, "operation_id", operation_id)
                    }
                  />
                </td>
                <td>
                  <p className="form2-table-column1-text">К-сть. діб:</p>
                </td>
                <td>
                  <DayInput
                    days={days}
                    updateDays={updateDays}
                    formIndex={formIndex}
                    value={form.day}
                    locked={form.locked}
                    forms={forms}
                    setForms={setForms}
                    onDayId={(preoperative_day_id) =>
                      onFieldChange(
                        formIndex,
                        "preoperative_day_id",
                        preoperative_day_id
                      )
                    }
                  />
                </td>
              </tr>
              <tr className="form2-table2">
                <td>№</td>
                <td>Назва</td>
                <td className="form2-table-size3">Кількість</td>
                <td className="form2-table-size4">Тип</td>
                <td>Примітки</td>
                <td>Управління</td>
              </tr>
              {form.rows.map((row, rowIndex) => (
                <tr className="form2-new-row" key={`${formIndex}-${rowIndex}`}>
                  <td>{rowIndex + 1}</td>
                  <td>
                    <MedicamentInput
                      medicaments={medicaments}
                      updateMedicaments={updateMedicaments}
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.medicaments}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                      onMedicamentId={(medicament_id) =>
                        onFieldChange(formIndex, "medicament_id", medicament_id)
                      }
                    />
                  </td>
                  <td>
                    <QuantityInput
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.quantity_of_medicament}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                    />
                  </td>
                  <td>
                    <TypeSelect
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.unit_of_measurement}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                    />
                  </td>
                  <td>
                    <NotesInput
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.notation}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                    />
                  </td>
                  <td className="btn-row">
                    <CopyRowButton
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      formLocked={form.locked}
                      forms={forms}
                      setFormsWithStorage={setFormsWithStorage}
                    />
                    <DeleteRowButton
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      formLocked={form.locked}
                      forms={forms}
                      setFormsWithStorage={setFormsWithStorage}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form1-btns">
            <button
              type="button"
              className="form1-btn-save"
              disabled={form.locked}
              onClick={() => handleSaveForm(formIndex)}
            >
              Зберегти форму
            </button>
            <button
              type="button"
              onClick={() => onAddRow(formIndex)}
              className="form1-btn-add"
              disabled={form.locked}
            >
              <i className="bx bx-plus bx-sm"></i>
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        id="add-row-form2"
        className="add-new-form2"
        onClick={onAddNewForm}
      >
        <i className="bx bx-plus bx-sm"></i>
      </button>

      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        value={
          activeFormIndex !== null ? forms[activeFormIndex].patientName : ""
        }
        onGetAge={(age) => onFieldChange(activeFormIndex, "age", age)}
        onGetFullName={(patientName) =>
          onFieldChange(activeFormIndex, "patientName", patientName)
        }
        onGetBirthday={(birthday) =>
          onFieldChange(activeFormIndex, "birthday", birthday)
        }
        onGetId={(id) => onFieldChange(activeFormIndex, "patient_id", id)}
      />
      <ModalPatientCreate
        isOpen={isModalOpenCreate}
        onClose={toggleModalCreate}
        value={
          activeFormIndex !== null ? forms[activeFormIndex].patientName : ""
        }
        onGetAge={(age) => onFieldChange(activeFormIndex, "age", age)}
        onGetFullName={(patientName) =>
          onFieldChange(activeFormIndex, "patientName", patientName)
        }
        onGetBirthday={(birthday) =>
          onFieldChange(activeFormIndex, "birthday", birthday)
        }
        onGetId={(id) => onFieldChange(activeFormIndex, "patient_id", id)}
      />
    </>
  );
};
