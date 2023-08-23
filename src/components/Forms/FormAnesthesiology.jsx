//Todo бібліотека дати!!!!!
//Todo додати валідацію на інпут доба

import { useState, useEffect } from "react";
import "./FormAnesthesiology.css";
import axios from "../../api/axios";

//Інпути зі списками з бекенду
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

  const savedForms = localStorage.getItem("anesthesiologyForms");
  const initialForms = savedForms
    ? JSON.parse(savedForms)
    : [
        {
          id: 0,
          locked: false,
          rows: [
            {
              medicaments: "",
              quantity: 0,
              type: "units",
              notes: "",
            },
          ],
          doctorName: myData.full_name || "", // Додаткові поля
          date: "",
          birthday: "",
          historyNumber: "0",
          patientName: "",
          age: "", // Убедитесь, что это поле инициализировано
          diagnoses: "",
          operations: "",
          day: "",
        },
      ];

  const [forms, setForms] = useState(initialForms);

  const onAddNewForm = () => {
    const newForm = {
      id: forms.length,
      locked: false,
      rows: [
        {
          medicaments: "",
          quantity: 0,
          type: "units",
          notes: "",
        },
      ],
      doctorName:  myData.full_name || "",
      date: "",
      birthday: "",
      historyNumber: "0",
      patientName: "",
      age: "",
      diagnoses: "",
      operations: "",
      day: "",
      // ... другие поля, если они есть
    };

    const newForms = [...forms, newForm];
    setFormsWithStorage(newForms); // Обновление localStorage
  };

  const onFieldChange = (formIndex, fieldName, value) => {
    const updatedForms = [...forms];
    updatedForms[formIndex][fieldName] = value;
    setFormsWithStorage(updatedForms);
  };

  const onGeneralInputChange = (formIndex, field, value) => {
    const updatedForms = [...forms];
    updatedForms[formIndex][field] = value;
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

  const onLockForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].locked = !updatedForms[formIndex].locked;
    setFormsWithStorage(updatedForms);
  };

  const onDeleteForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms.splice(formIndex, 1);
    setFormsWithStorage(updatedForms);
  };

  const onAddRow = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].rows.push({
      medicaments: "",
      quantity: 0,
      type: "units",
      notes: "",
    });
    setFormsWithStorage(updatedForms); // Обновление localStorage
  };

  // для дати
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const currentDate = getCurrentDate();

  // для отправки таблицы на бек

  const handleSaveForm = (formIndex) => {
    const currentForm = forms[formIndex];
    console.log(currentForm);
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
            <i className="bx bx-copy bx-sm form1-copy"></i>
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
                <td colSpan="7" >
                  <p className="form-table-name-user" >
                    {myData.full_name}     ({myData.job_title})
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
                    name="historyNumber"
                    className="form1-table-number"
                    value={form.historyNumber}
                    onChange={(e) =>
                      onGeneralInputChange(
                        formIndex,
                        "historyNumber",
                        e.target.value
                      )
                    }
                    disabled={form.locked}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p className="form2-table-column1-text">Хворий:</p>
                </td>

                <td colSpan="3" className="form-patient">
                  <p>{form.patientName}</p>
                  <div className="btns-patient">
                    <button
                      type="button"
                      className="btn-patient one"
                      onClick={onBtnClickSearchPatient}
                      disabled={form.locked}
                    >
                      <i className="bx bx-search bx-sm"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-patient"
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
                  />
                </td>

                <td>
                  <p className="form2-table-column1-text">Вік:</p>
                </td>

                <td>
                  <p>{form.age}</p>
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
                  />
                </td>
                <td>
                  <p className="form2-table-column1-text">Дата народження:</p>
                </td>
                <td>{form.birthday}</td>
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
                    />
                  </td>
                  <td>
                    <QuantityInput
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.quantity}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                    />
                  </td>
                  <td>
                    <TypeSelect
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.type}
                      locked={form.locked}
                      forms={forms}
                      setForms={setForms}
                    />
                  </td>
                  <td>
                    <NotesInput
                      formIndex={formIndex}
                      rowIndex={rowIndex}
                      value={row.notes}
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
