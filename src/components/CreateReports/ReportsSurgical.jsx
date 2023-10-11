import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import $api from "../../api/api";
import { useSpring, animated } from "react-spring";


//* Core components
import { DayInput } from "./СoreComponentsReports/DayInput";
import { DiagnosesInput } from "./СoreComponentsReports/DiagnosesInput";
import { OperationsInput } from "./СoreComponentsReports/OperationsInput";
import { ModalPatientCreate } from "./СoreComponentsReports/ModalPatientCreate";
import { ModalPatientSearch } from "./СoreComponentsReports/ModalPatientSearch";

//* Row components
import { MedicamentInput } from "./СoreComponentsReports/MedicamentInput";
import { QuantityInput } from "./СoreComponentsReports/QuantityInput";
import { TypeSelect } from "./СoreComponentsReports/TypeSelect";
import { NotesInput } from "./СoreComponentsReports/NotesInput";
import { CopyRowButton } from "./СoreComponentsReports/CopyRowButton";
import { DeleteRowButton } from "./СoreComponentsReports/DeleteRowButton";

export const ReportsSurgical = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [myData, setmyData] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [days, setDays] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isModalOpenCreate, setModalOpenCreate] = useState(false);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(null);

  const [exitingFormIndex, setExitingFormIndex] = useState(null);

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
  const savedForms = localStorage.getItem("surgeryForms");
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
              quantity_of_medicament: "",
              unit_of_measurement: "",
              notation: "",
            },
          ],
          doctorName: myData.full_name || "",
          date: "",
          birthday: "",
          history_number: "",
          patient_id: "0",
          preoperative_day_id: "0",
          operation_id: "0",
          diagnosis_id: "0",
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
          quantity_of_medicament: "",
          unit_of_measurement: "",
          notation: "",
        },
      ],
      doctorName: myData.full_name || "",
      date: "",
      birthday: "",
      history_number: "",
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
    localStorage.setItem("surgeryForms", JSON.stringify(newForms));
    setForms(newForms);
  };

  useEffect(() => {
    const savedForms = localStorage.getItem("surgeryForms");
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  //* УПРАВЛІННЯ ТАБЛИЦЕЮ

  // блок форми
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
    const copiedForm = { ...formToCopy, id: nextFormId };
    setNextFormId(nextFormId + 1);
    const updatedForms = [...forms, copiedForm];
    setFormsWithStorage(updatedForms);
  };

  // додавання у форму нової строки
  const onAddRow = (formIndex) => {
    const updatedForms = [...forms];

    if (forms[formIndex].rows.length >= 99) {
      toast.warn(
        "Ви досягли максимальної кількості рядків (99). Додавання нових рядків неможливе."
      );
      return;
    }

    updatedForms[formIndex].rows.push({
      medicament_id: "0",
      medicaments: "",
      quantity_of_medicament: "",
      unit_of_measurement: "",
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
      history_number: sanitizeValue(form.history_number),
      patient_id: form.patient_id,
      diagnosis_id: form.diagnosis_id ? form.diagnosis_id : null,
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

  const onSaveForm = (formIndex) => {
    const currentForm = forms[formIndex];
    const dataToSend = convertFormToSend(currentForm);
    console.log(dataToSend);

    $api
      .post("/reports/surgery", dataToSend)
      .then((response) => {
        console.log(response);
        toast.success(`Нова таблиця успішно збережена`, {
          autoClose: 1500,
        });
        setTimeout(() => {
          handleDelete(formIndex);
        }, 2500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //* ПОМИЛКИ ДЛЯ ІНПУТІВ
  // Основні поля для перевірки в формі
  const MAIN_FIELDS = {

    patientName: '"Ім\'я пацієнта"',
    operations: '"Операція"',
    day: '"К-сть. діб"',
  };

  // Поля для перевірки в рядках форми
  const ROW_FIELDS = {
    medicaments: '"Назва препарату"',
    quantity_of_medicament: '"Кількість"',
    unit_of_measurement: '"Одиниця вимірювання"',
  };

  // Отримання повідомлення про відсутні поля в формі
  const getMissingFieldsMessage = (form, fields) => {
    const missingFields = Object.keys(fields)
      .filter((field) => !form[field] || !form[field].toString().trim())
      .map((field) => fields[field])
      .join(", ");

    if (!missingFields) return "";

    return `${
      missingFields.split(", ").length > 1
        ? "Не заповнені поля"
        : "Не заповнене поле"
    }: ${missingFields}!`;
  };

  // Отримання індексів рядків з відсутніми полями
  const getInvalidRows = (rows, fields) => {
    return rows
      .map((row, idx) =>
        !Object.keys(fields).every(
          (field) => row[field] && row[field].toString().trim()
        )
          ? idx
          : -1
      )
      .filter((idx) => idx !== -1);
  };

  // Головна функція для відкриття модального вікна збереження
  // після перевірки форми на відсутні поля
  const openSaveModalWithIndex = (formIndex) => {
    // Отримання поточної форми на основі індексу
    const form = forms[formIndex];

    // Перевірка на 1 обовязковий рядок
    if (form.rows.length === 0) {
      toast.warn("Форма не може бути порожньою. Додайте хоча б один рядок!", {
        autoClose: 2500,
      });
      return;
    }

    // Перевірка основних полів форми на відсутність
    const missingMainFieldsMessage = getMissingFieldsMessage(form, MAIN_FIELDS);

    // Якщо є відсутні поля, показуємо відповідне повідомлення
    if (missingMainFieldsMessage) {
      toast.warn(missingMainFieldsMessage, {
        autoClose: 4500,
      });
    }

    // Отримання індексів рядків, які мають відсутні поля
    const invalidRowIndices = getInvalidRows(form.rows, ROW_FIELDS);

    // Для кожного недійсного рядка відображаємо повідомлення про відсутні поля
    invalidRowIndices.forEach((idx) => {
      const invalidFields = Object.keys(ROW_FIELDS)
        .filter(
          (field) =>
            !(form.rows[idx][field] && form.rows[idx][field].toString().trim())
        )
        .map((field) => ROW_FIELDS[field])
        .join(", ");

      const fieldText = invalidFields.split(", ").length > 1 ? "поля" : "поле";
      const verb =
        invalidFields.split(", ").length > 1
          ? "не заповнені!"
          : "не заповнене!";

      // Показуємо повідомлення про відсутні поля у конкретному рядку
      toast.warn(`В рядку ${idx + 1}, ${fieldText}: ${invalidFields} ${verb}`, {
        autoClose: 4500,
      });
    });

    // Якщо немає жодних помилок, встановлюємо поточний індекс форми та показуємо модальне вікно збереження
    if (!missingMainFieldsMessage && !invalidRowIndices.length) {
      setCurrentFormIndex(formIndex);
      setShowSaveModal(true);
    }
  };

  //* ДЛЯ АНІМАЦІЇ ПОЯВИ ТА ВИДАЛЕННЯ ФОРМ

  const fadeOutAnimation = useSpring({
    opacity: exitingFormIndex !== null ? 0 : 1,
    transform:
      exitingFormIndex !== null ? "translateY(-100%)" : "translateY(0%)",
    config: { duration: 200 },
  });

  const handleDelete = (formIndex) => {
    setExitingFormIndex(formIndex);
    setTimeout(() => {
      onDeleteForm(formIndex);
      setExitingFormIndex(null);
    }, 200); // совпадает с длительностью анимации
  };

  const handleAddNewForm = () => {
    onAddNewForm();
  };

  return (
    <>
      {forms.map((form, formIndex) => (
        <animated.div
          style={formIndex === exitingFormIndex ? fadeOutAnimation : {}}
          key={form.id}
        >
          <div
            className={`form2-table ${form.locked ? "locked" : ""} ${
              formIndex === forms.length - 1 ? "fade-in" : ""
            }`}
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
                onClick={() => handleDelete(formIndex)}
              ></i>
            </div>
            <table>
              <thead>
                <tr>
                  <th colSpan="7" className="form1-table-title">
                    ХІРУРГІЯ
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
                      autoComplete="off"
                      onChange={(e) =>
                        onFieldChange(
                          formIndex,
                          "history_number",
                          e.target.value
                        )
                      }
                      disabled={form.locked}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="form2-table-column1-text">
                      <span className="required">*</span>&nbsp;Пацієнт:
                    </p>
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
                      localStorageKey="surgeryForms"
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
                    <p className="form2-table-column1-text">
                      <span className="required">*</span>&nbsp;Операція:
                    </p>
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
                      localStorageKey="surgeryForms"
                      onOperationId={(operation_id) =>
                        onFieldChange(formIndex, "operation_id", operation_id)
                      }
                    />
                  </td>
                  <td>
                    <p className="form2-table-column1-text">
                      <span className="required">*</span>&nbsp;К-сть. діб:
                    </p>
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
                      localStorageKey="surgeryForms"
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
                  <td>
                    <span className="required">*</span>&nbsp;Назва препарату
                  </td>
                  <td className="form2-table-size3">
                    <p title="Кількість">
                      <span className="required">*</span>&nbsp;К-сть.
                    </p>
                  </td>
                  <td className="form2-table-size4">
                    <p title="Одиниці вимірювання">
                      <span className="required">*</span>&nbsp;Од. вим.
                    </p>
                  </td>
                  <td>Примітки</td>
                  <td>Управління</td>
                </tr>
                {form.rows.map((row, rowIndex) => (
                  <tr
                    className="form2-new-row"
                    key={`${formIndex}-${rowIndex}`}
                  >
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
                        localStorageKey="surgeryForms"
                        onMedicamentId={(medicament_id) =>
                          onFieldChange(
                            formIndex,
                            "medicament_id",
                            medicament_id
                          )
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
                        localStorageKey="surgeryForms"
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
                        localStorageKey="surgeryForms"
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
                        localStorageKey="surgeryForms"
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
                onClick={() => openSaveModalWithIndex(formIndex)}
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
        </animated.div>
      ))}
      <button
        type="button"
        id="add-row-form2"
        className="add-new-form2"
        onClick={handleAddNewForm}
      >
        <i className="bx bx-plus bx-sm"></i>
      </button>
      {showSaveModal && (
        <div className="confirm-modal">
          <p>Зберегти форму?</p>
          <button
            onClick={() => {
              onSaveForm(currentFormIndex);
              setShowSaveModal(false);
            }}
          >
            Так
          </button>
          <button onClick={() => setShowSaveModal(false)}>Відмінити</button>
        </div>
      )}
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
