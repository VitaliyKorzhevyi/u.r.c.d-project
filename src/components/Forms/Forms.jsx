import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FormAnesthesiology } from "./FormAnesthesiology";
import { FormOperational } from "./FormOperational";
import { FormReanimation } from "./FormReanimation";
import { FormSurgical } from "./FormSurgical";
import { FormConsultation } from "./FormConsultation";

import './Forms.css';

export const Forms = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialForm = params.get("form") || "anesthesiology";
  const [activeForm, setActiveForm] = useState(initialForm);

  const onFormChange = (form) => {
    setActiveForm(form);
    const newUrl = `${window.location.pathname}?form=${form}`;
    window.history.replaceState(null, '', newUrl);
  };

  useEffect(() => {
    const currentForm = new URLSearchParams(location.search).get("form") || "anesthesiology";
    setActiveForm(currentForm);
  }, [location.search]);

  return (
    <div>
      <div className="admin-header">
        <div className="admin-buttons">
          <button type="button" onClick={() => onFormChange('anesthesiology')}>Анестезіологія</button>
          <button type="button" onClick={() => onFormChange('operational')}>Операційна</button>
          <button type="button" onClick={() => onFormChange('reanimation')}>Реанімація</button>
          <button type="button" onClick={() => onFormChange('surgical')}>Хірургія</button>
          <button type="button" onClick={() => onFormChange('consultation')}>Консультація</button>
        </div>
      </div>
      {activeForm === 'anesthesiology' && <FormAnesthesiology />}
      {activeForm === 'operational' && <FormOperational />}
      {activeForm === 'reanimation' && <FormReanimation />}
      {activeForm === 'surgical' && <FormSurgical />}
      {activeForm === 'consultation' && <FormConsultation />}
    </div>
  );
};








// // ДЛЯ СПИСКУ ДІБ
// const [showConfirmModalDay, setshowConfirmModalDay] = useState(false); // значення модалки
// const [pendingDay, setPendingDay] = useState("");

// // Додано: індекс форми для зберігання дня

// const onDayInputBlur = (currentIndex, value) => {
//   setFormIndex(currentIndex); // Зберігаємо поточний індекс форми
//   if (value.trim() === "") {
//     return;
//   }
//   // Якщо filteredDays не пустий, користувач вибрав день з випадаючого списку
//   if (filteredDays.length > 0) {
//     return;
//   }

//   const isValueExists = daysData.some(
//     (day) => day.title.toLowerCase() === value.toLowerCase()
//   );

//   if (!isValueExists) {
//     setPendingDay(value);
//     setshowConfirmModalDay(true);
//   }
// };

// const onConfirmYesDay = async () => {
//   try {
//     const response = await axios.post("/preoperative-days", pendingDay, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         "Content-Type": "application/json",
//       },
//     });

//     // обновляем список
//     setDaysData([...daysData, response.data]);
//     setshowConfirmModalDay(false);
//   } catch (error) {
//     console.error("Error during saving new day", error);
//   }
// };

// const [daysData, setDaysData] = useState([]); // для хранения данных с сервера
// const [filteredDays, setFilteredDays] = useState([]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("/preoperative-days", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response.data);
//       setDaysData(response.data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   fetchData();
// }, []);

// const onDayInputChange = (formIndex, value) => {
//   onGeneralInputChange(formIndex, "day", value);

//   const filtered = daysData.filter((day) =>
//     day.title.toLowerCase().includes(value.toLowerCase())
//   );
//   setFilteredDays(filtered);
// };

// const onDayItemClick = (formIndex, dayName) => {
//   onGeneralInputChange(formIndex, "day", dayName);
//   setFilteredDays([]); // очищаем список после выбора
// };

// const onCancelDay = () => {
//   if (formIndex !== null) {
//     const updatedForms = [...forms];
//     updatedForms[formIndex].day = ""; // очищення поля вводу
//     setFormsWithStorage(updatedForms);
//   }
//   setshowConfirmModalDay(false);
// };

// //_____________________________________________________________

// // ДЛЯ СПИСКУ ДІАГНОЗІВ

// const [showConfirmModalDiagnoses, setshowConfirmModalDiagnoses] =
//   useState(false); // значення модалки
// const [pendingDiagnoses, setPendingDiagnoses] = useState("");

// // Додано: індекс форми для зберігання дня

// const onDiagnosesInputBlur = (currentIndex, value) => {
//   setFormIndex(currentIndex); // Зберігаємо поточний індекс форми
//   if (value.trim() === "") {
//     return;
//   }

//   // Якщо filteredDiagnoses не пустий, користувач вибрав день з випадаючого списку
//   if (
//     filteredDiagnoses[currentIndex] &&
//     filteredDiagnoses[currentIndex].length > 0
//   ) {
//     return;
//   }

//   const isValueExists = diagnosesData.some(
//     (diagnoses) => diagnoses.title.toLowerCase() === value.toLowerCase()
//   );

//   if (!isValueExists && value.trim() !== "") {
//     setPendingDiagnoses(value);
//     setshowConfirmModalDiagnoses(true);
//   }
// };

// const onConfirmYesDiagnoses = async () => {
//   try {
//     const response = await axios.post("/diagnoses", pendingDiagnoses, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         "Content-Type": "application/json",
//       },
//     });

//     // обновляем список
//     setDiagnosesData([...diagnosesData, response.data]);
//     setshowConfirmModalDiagnoses(false);
//   } catch (error) {
//     console.error("Error during saving new diagnoses", error);
//   }
// };

// const [diagnosesData, setDiagnosesData] = useState([]); // для хранения данных с сервера
// const [filteredDiagnoses, setFilteredDiagnoses] = useState({});

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("/diagnoses", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response.data);
//       setDiagnosesData(response.data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   fetchData();
// }, []);

// const onDiagnosesInputChange = (formIndex, value) => {
//   onGeneralInputChange(formIndex, "diagnoses", value);

//   const filtered = diagnosesData.filter((diagnoses) =>
//     diagnoses.title.toLowerCase().includes(value.toLowerCase())
//   );

//   setFilteredDiagnoses({
//     ...filteredDiagnoses,
//     [formIndex]: filtered,
//   });
// };

// const onDiagnosesItemClick = (formIndex, diagnosesName) => {
//   onGeneralInputChange(formIndex, "diagnoses", diagnosesName);
//   setFilteredDiagnoses({
//     ...filteredDiagnoses,
//     [formIndex]: [],
//   }); // очищаем список после выбора
// };

// const onCancelDiagnoses = () => {
//   if (formIndex !== null) {
//     const updatedForms = [...forms];
//     updatedForms[formIndex].diagnoses = ""; // очищення поля вводу
//     setFormsWithStorage(updatedForms);
//   }
//   setshowConfirmModalDiagnoses(false);
// };

// //_____________________________________________________________

// // ДЛЯ СПИСКУ ОПЕРАЦІЙ

// const [showConfirmModalOperations, setShowConfirmModalOperations] =
//   useState(false); // значення модалки
// const [pendingOperations, setPendingOperations] = useState("");

// const onOperationsInputBlur = (currentIndex, value) => {
//   setFormIndex(currentIndex); // Зберігаємо поточний індекс форми
//   if (value.trim() === "") {
//     return;
//   }

//   // Якщо filteredOperations не пустий, користувач вибрав день з випадаючого списку
//   if (
//     filteredOperations[currentIndex] &&
//     filteredOperations[currentIndex].length > 0
//   ) {
//     return;
//   }

//   const isValueExists = operationsData.some(
//     (operations) => operations.title.toLowerCase() === value.toLowerCase()
//   );

//   if (!isValueExists && value.trim() !== "") {
//     setPendingOperations(value);
//     setShowConfirmModalOperations(true);
//   }
// };

// const onConfirmYesOperations = async () => {
//   try {
//     const response = await axios.post("/operations", pendingOperations, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         "Content-Type": "application/json",
//       },
//     });

//     // обновляем список
//     setOperationsData([...operationsData, response.data]);
//     setShowConfirmModalOperations(false);
//   } catch (error) {
//     console.error("Error during saving new operations", error);
//   }
// };

// const [operationsData, setOperationsData] = useState([]); // для хранения данных с сервера
// const [filteredOperations, setFilteredOperations] = useState({});

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("/operations", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response.data);
//       setOperationsData(response.data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   fetchData();
// }, []);

// const onOperationsInputChange = (formIndex, value) => {
//   onGeneralInputChange(formIndex, "operations", value);

//   const filtered = operationsData.filter((operations) =>
//     operations.title.toLowerCase().includes(value.toLowerCase())
//   );

//   setFilteredOperations({
//     ...filteredOperations,
//     [formIndex]: filtered,
//   });
// };

// const onOperationsItemClick = (formIndex, operationsName) => {
//   onGeneralInputChange(formIndex, "Operations", operationsName);
//   setFilteredOperations({
//     ...filteredOperations,
//     [formIndex]: [],
//   }); // очищаем список после выбора
// };

// const onCancelOperations = () => {
//   if (formIndex !== null) {
//     const updatedForms = [...forms];
//     updatedForms[formIndex].operations = ""; // очищення поля вводу
//     setFormsWithStorage(updatedForms);
//   }
//   setShowConfirmModalOperations(false);
// };

















// модалки.......


//     {showConfirmModalDay && (
//       <div className="confirm-modal">
//         <p>Чи дійсно ви хочете зберегти: "{pendingDay}"</p>
//         <button onClick={onConfirmYesDay}>OK</button>
//         <button onClick={onCancelDay}>Скасувати</button>
//       </div>
//     )}

//     {showConfirmModalDiagnoses && (
//       <div className="confirm-modal">
//         <p>Чи дійсно ви хочете зберегти: "{pendingDiagnoses}"</p>
//         <button onClick={onConfirmYesDiagnoses}>OK</button>
//         <button onClick={onCancelDiagnoses}>Скасувати</button>
//       </div>
//     )}

//     {showConfirmModalOperations && (
//       <div className="confirm-modal">
//         <p>Чи дійсно ви хочете зберегти: "{pendingOperations}"</p>
//         <button onClick={onConfirmYesOperations}>OK</button>
//         <button onClick={onCancelOperations}>Скасувати</button>
//       </div>
//     )}








// инпути

//                 <div>
//                   <input
//                     type="text"
//                     name="diagnoses"
//                     className="form1-table-text-name"
//                     value={form.diagnoses}
//                     onChange={(e) =>
//                       onDiagnosesInputChange(formIndex, e.target.value)
//                     }
//                     onBlur={(e) =>
//                       onDiagnosesInputBlur(formIndex, e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         onDiagnosesInputBlur(formIndex, e.target.value);
//                       }
//                     }}
//                     disabled={form.locked}
//                   />
//                   {filteredDiagnoses[formIndex] &&
//                     filteredDiagnoses[formIndex].length > 0 && (
//                       <ul className="days-dropdown">
//                         {filteredDiagnoses[formIndex].map((diagnoses) => (
//                           <li
//                             key={diagnoses.id}
//                             onClick={() =>
//                               onDiagnosesItemClick(formIndex, diagnoses.title)
//                             }
//                           >
//                             {diagnoses.title}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                 </div>






//                 <input
//                   type="text"
//                   name="operations"
//                   className="form1-table-text-name"
//                   value={form.operations}
//                   onChange={(e) =>
//                     onOperationsInputChange(formIndex, e.target.value)
//                   }
//                   onBlur={(e) =>
//                     onOperationsInputBlur(formIndex, e.target.value)
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       onOperationsInputBlur(formIndex, e.target.value);
//                     }
//                   }}
//                   disabled={form.locked}
//                 />
//                 {filteredOperations[formIndex] &&
//                   filteredOperations[formIndex].length > 0 && (
//                     <ul className="days-dropdown">
//                       {filteredOperations[formIndex].map((operations) => (
//                         <li
//                           key={operations.id}
//                           onClick={() =>
//                             onOperationsItemClick(formIndex, operations.title)
//                           }
//                         >
//                           {operations.title}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
