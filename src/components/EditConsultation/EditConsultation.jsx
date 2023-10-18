import { useState } from "react";

import { SortConsultatuon } from "./SortConsultatuon";
import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import "./EditConsultation.css";

export const EditConsultation = () => {
  const [data, setData] = useState([]);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);

  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  //* ДЛЯ ЗБЕРАГІННЯ ВІДРЕДАГОВАНИХ ЗНАЧЕНЬ
  const [formData, setFormData] = useState({
    id: null,
    receipt_number: "",
    patient_id: null,
    is_free: "",
    discount: "",
    medication_prescribed: "",
    notation: "",
    full_name: "",
    phone: "",
  });

  //   console.log("відредаговані значення", formData);

  //* РЕДАГУВАННЯ НОМЕРА КОНСУЛЬТАЦІЇ
  const onInputReceiptNumber = (e, id, date) => {
    const newValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      receipt_number: newValue,
    }));

    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, receipt_number: newValue };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ПАЦІЄНТА

  const toggleModalSearch = (id, date) => {
    setSelectedConsultationId(id); // Сохраняем ID в состоянии
    setSelectedDate(date); // Сохраняем дату в состоянии
    setModalOpenSearch(!isModalOpenSearch);
  };

  const onInputPatientData = (dataPatient) => {
    const newValue = dataPatient;

    const updatedData = { ...data };
    const updatedConsultations = updatedData[selectedDate].map(
      (consultation) => {
        if (consultation.id === selectedConsultationId) {
          const updatedPatient = {
            ...consultation.patient,
            id: newValue.id,
            full_name: newValue.full_name, // Обновляем full_name
            phone: newValue.phone, // Обновляем phone
          };
          console.log("Старый consultation.patient:", consultation.patient);
          console.log("Новый consultation.patient:", updatedPatient);
          return { ...consultation, patient: updatedPatient };
        }
        return consultation;
      }
    );
    updatedData[selectedDate] = updatedConsultations;
    console.log("Старый data:", data);
    console.log("Новый data:", updatedData);
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ПЛАТНО
  const onInputIsFree = (e, id, date) => {
    const newValue = e.target.checked;

    setFormData((prevData) => ({
      ...prevData,
      is_free: newValue,
    }));

    const updatedData = { ...data };
    // Найдите консультацию с соответствующим id и обновите is_free
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, is_free: newValue };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ВИПИСАНІ ЛІКИ
  const onInputMedPre = (e, id, date) => {
    const newValue = e.target.checked;

    setFormData((prevData) => ({
      ...prevData,
      medication_prescribed: newValue,
    }));

    const updatedData = { ...data };
    // Найдите консультацию с соответствующим id и обновите is_free
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, medication_prescribed: newValue };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ НОТАТКІВ
  const onInputNotation = (e, id, date) => {
    const newValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      notation: newValue,
    }));

    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, notation: newValue };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editConsultation, setEditConsultation] = useState(null);

  const openEditModal = (consultation) => {
    setEditConsultation(consultation);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    // Закрываем модальное окно редактирования
    setEditModalOpen(false);
  };

  const saveEditedData = () => {

    console.log("рядок", editConsultation);
    setEditModalOpen(false);
  };

  return (
    <div className="cons-big-container">
      <SortConsultatuon data={setData} />
      <div className="cons-big-container-data">
        {Object.keys(data).map((date) => (
          <div key={date}>
            <h2 className="cons-big-container-title-date">{date}</h2>
            <table className="cons-big-table-title">
              <thead>
                <tr>
                  <th className="cons-big-container-data-size1">
                    Номер талону квитанції
                  </th>
                  <th className="cons-big-container-data-size2">
                    відвідувач/хворий
                  </th>
                  <th className="cons-big-container-data-size3">Платно</th>
                  <th className="cons-big-container-data-size3">Знижка %</th>
                  <th className="cons-big-container-data-size3">
                    Виписані ліки
                  </th>
                  <th className="cons-big-container-data-size4">Примітки</th>
                  <th className="cons-big-container-data-size5">Дії</th>
                </tr>
              </thead>

              <tbody>
                {data[date].map((consultation) => (
                  <tr key={consultation.id}>
                    <td className="cons-big-container-data-size1">
                      <input
                        className="cons-table-edit-rec-n"
                        type="text"
                        value={consultation.receipt_number || ""}
                        onChange={(e) =>
                          onInputReceiptNumber(e, consultation.id, date)
                        }
                      />
                    </td>
                    <td className="cons-big-container-data-size2">
                      <div className="cons-big-container-data-patient">
                        <p>П.і.Б. {consultation.patient.full_name}</p>
                        <p>Телефон: {consultation.patient.phone}</p>
                      </div>
                    </td>
                    <td className="cons-big-container-data-size3">
                      <input
                        type="checkbox"
                        checked={consultation.is_free}
                        onChange={(e) =>
                          onInputIsFree(e, consultation.id, date)
                        }
                      />
                    </td>
                    <td className="cons-big-container-data-size3">
                      {consultation.discount}
                    </td>
                    <td className="cons-big-container-data-size3">
                      <input
                        type="checkbox"
                        checked={consultation.medication_prescribed}
                        onChange={(e) =>
                          onInputMedPre(e, consultation.id, date)
                        }
                      />
                    </td>
                    <td className="cons-big-container-data-size4">
                      <input
                        className="cons-table-edit-notation"
                        type="text"
                        value={consultation.notation || ""}
                        onChange={(e) =>
                          onInputNotation(e, consultation.id, date)
                        }
                      />
                    </td>
                    <td className="cons-big-container-data-size5">
                      <div className="cons-big-container-data-btns">
                        <button
                          type="button"
                          onClick={() => {
                            toggleModalSearch(consultation.id, date);
                          }}
                        >
                          <i className="bx bx-user bx-sm"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(consultation)}
                        >
                          <i className="bx bx-edit-alt bx-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <ModalPatientSearch
        isOpen={isModalOpenSearch}
        onClose={toggleModalSearch}
        onGetData={(dataPatient) => onInputPatientData(dataPatient)}
      />
      {isEditModalOpen && (
        <div className="confirm-modal">
          <p>Зберегти зміни?</p>
          <div className="confirm-modal-btn-save">
            <button onClick={closeEditModal}>Ні</button>
            <button onClick={() => saveEditedData()}>Так</button>
          </div>
        </div>
      )}
    </div>
  );
};
