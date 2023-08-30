import { useState, useEffect } from "react";
import './FormResuscitation.css'
import axios from "../../api/axios";

//Інпути зі списками з бекенду
import { ModalPatientCreate } from "./ModalWindows/ModalPatientCreate";
import { ModalPatientSearch } from "./ModalWindows/ModalPatientSearch";
import { MedicamentInput } from "./ResuscitationFormComponents/MedicamentInput";
import { DayInput } from "./ResuscitationFormComponents/DayInput";
import { DiagnosesInput } from "./ResuscitationFormComponents/DiagnosesInput";
import { OperationsInput } from "./ResuscitationFormComponents/OperationsInput";

import { QuantityInput } from "./ResuscitationFormComponents/QuantityInput";
import { TypeSelect } from "./ResuscitationFormComponents/TypeSelect";
import { NotesInput } from "./ResuscitationFormComponents/NotesInput";

import { CopyRowButton } from "./ResuscitationFormComponents/CopyRowButton";
import { DeleteRowButton } from "./ResuscitationFormComponents/DeleteRowButton";

export const FormResuscitation = () => {
  //данні про мене
  const [myData, setmyData] = useState([]);

  useEffect(() => {
    axios
      .get("/users/me/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setmyData(response.data);
      });
  }, []);

  // для збереження медикаментів в стейт
  const [medicaments, setMedicaments] = useState([]);

  const updateMedicaments = (newMedicament) => {
    setMedicaments((prevMedicaments) => [...prevMedicaments, newMedicament]);
  };

  useEffect(() => {
    axios
      .get("/medicaments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setMedicaments(response.data);
      });
  }, []);

  //__________________________

  // для збереження днів (передопераційна доба)

  const [days, setDays] = useState([]);

  const updateDays = (newDay) => {
    setDays((prevDays) => [...prevDays, newDay]);
  };

  useEffect(() => {
    axios
      .get("/preoperative-days", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setDays(response.data);
      });
  }, []);

  //__________________________

  // для збереження діагнозів

  const [diagnoses, setDiagnoses] = useState([]);

  const updateDiagnoses = (newDiagnoses) => {
    setDiagnoses((prevDiagnoses) => [...prevDiagnoses, newDiagnoses]);
  };

  useEffect(() => {
    axios
      .get("/diagnoses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setDiagnoses(response.data);
      });
  }, []);

  //__________________________

  // для збереження операцій

  const [operations, setOperations] = useState([]);

  const updateOperations = (newOperations) => {
    setOperations((prevOperations) => [...prevOperations, newOperations]);
  };

  useEffect(() => {
    axios
      .get("/operations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setOperations(response.data);
      });
  }, []);

  //__________________________

  // states модальних вікон
  const [onModalCreatePatient, setModalCreatePatient] = useState(false);
  const [onModalSearchPatient, setModalSearchPatient] = useState(false);

  //модальне вікно створення пацієнта
  const onBtnClickCreatePatient = () => {
    setModalCreatePatient(true);
  };

  const closeModalCreatePatient = () => {
    setModalCreatePatient(false);
  };

  //модальне вікно пошуку пацієнта

  const onBtnClickSearchPatient = () => {
    setModalSearchPatient(true);
  };

  const closeModalSearchPatient = () => {
    setModalSearchPatient(false);
  };

  // ЗБЕРІГАЄМО ДАННІ З ФОРМИ У ЛОКАЛЬНЕ СХОВИЩЕ
  const savedForms = localStorage.getItem("resuscitationForms");
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
          age: "", // Убедитесь, что это поле инициализировано
          diagnoses: "",
          operations: "",
          day: "",
        },
      ];

  const [forms, setForms] = useState(initialForms);
  const [nextFormId, setNextFormId] = useState(forms.length);

  // ДОДАЄМО НОВУ ФОРМУ
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
    localStorage.setItem("resuscitationForms", JSON.stringify(newForms));
    setForms(newForms);
  };

  useEffect(() => {
    const savedForms = localStorage.getItem("resuscitationForms");
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  // УПРАВЛІННЯ ТАБЛИЦЕЮ

  // блокіруєм форму
  const onLockForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].locked = !updatedForms[formIndex].locked;
    setFormsWithStorage(updatedForms);
  };

  // видаляємо форму
  const onDeleteForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms.splice(formIndex, 1);
    setFormsWithStorage(updatedForms);
  };

  // копіюємо форму
  const onCopyForm = (formIndex) => {
    const formToCopy = forms[formIndex];
    const copiedForm = { ...formToCopy, id: nextFormId }; // используйте nextFormId здесь
    setNextFormId(nextFormId + 1); // установите новый ID
    const updatedForms = [...forms, copiedForm];
    setFormsWithStorage(updatedForms);
  };

  // додаємо строку
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

  // для відображення дати
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const currentDate = getCurrentDate();

  // для отправки таблицы на бек

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

    // Здесь вы можете отправить dataToSend на бэкенд
    axios
      .post("/reports/resuscitation", dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
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
                <th colSpan="7" className="form4-table-title">
                  РЕАНІМАЦІЯ
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
                <td  className="form-patient form2-table-time form2-table-size5">
                  <div className="btns-patient">
                    <button
                      type="button"
                      className="btn-patient blue one"
                      onClick={onBtnClickSearchPatient}
                      disabled={form.locked}
                    >
                      <i className="bx bx-search bx-sm"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-patient green"
                      onClick={onBtnClickCreatePatient}
                      disabled={form.locked}
                    >
                      <i className="bx bx-plus bx-sm"></i>
                    </button>
                  </div>

                  <ModalPatientSearch
                    isOpen={onModalSearchPatient}
                    onClose={closeModalSearchPatient}
                    value={form.patientName}
                    onGetAge={(age) => onFieldChange(formIndex, "age", age)}
                    onGetFullName={(patientName) =>
                      onFieldChange(formIndex, "patientName", patientName)
                    }
                    onGetBirthday={(birthday) =>
                      onFieldChange(formIndex, "birthday", birthday)
                    }
                    onGetId={(id) => onFieldChange(formIndex, "patient_id", id)}
                  />
                  <ModalPatientCreate
                    isOpen={onModalCreatePatient}
                    onClose={closeModalCreatePatient}
                    value={form.patientName}
                    onGetAge={(age) => onFieldChange(formIndex, "age", age)}
                    onGetFullName={(patientName) =>
                      onFieldChange(formIndex, "patientName", patientName)
                    }
                    onGetBirthday={(birthday) =>
                      onFieldChange(formIndex, "birthday", birthday)
                    }
                    onGetId={(id) => onFieldChange(formIndex, "patient_id", id)}
                  />
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
    </>
  );
};
