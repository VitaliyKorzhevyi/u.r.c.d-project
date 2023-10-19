import { useState } from "react";
import { toast } from "react-toastify";
import $api from "../../api/api";

import { SortConsultatuon } from "./SortConsultatuon";
import { ModalPatientSearch } from "../CreateReports/СoreComponentsReports/ModalPatientSearch";
import "./EditConsultation.css";

export const EditConsultation = () => {
  const [data, setData] = useState([]);
  const [isModalOpenSearch, setModalOpenSearch] = useState(false);

  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  //* РЕДАГУВАННЯ НОМЕРА КОНСУЛЬТАЦІЇ
  const onInputReceiptNumber = (e, id, date) => {
    const newValue = e.target.value;
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
  const onInputIsFree = (id, date, isFree) => {
    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        const newIsFree = consultation.discount === 100 ? true : isFree;
        return { ...consultation, is_free: newIsFree };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ЗНИЖКИ
  const onInputDiscount = (e, id, date) => {
    let newValue = parseInt(e.target.value, 10);
  
    // Ограничиваем значение в пределах от 0 до 100
    newValue = Math.min(100, Math.max(0, newValue));
  
    // Если значение скидки равно 100, устанавливаем is_free в true, иначе в false
    const isFree = newValue === 100;
  
    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, discount: newValue, is_free: isFree };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ВИПИСАНІ ЛІКИ
  const onInputMedPre = (id, date) => {
    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return {
          ...consultation,
          medication_prescribed: !consultation.medication_prescribed,
        };
      }
      return consultation;
    });
    updatedData[date] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ НОТАТКІВ
  const onInputNotation = (e, id, date) => {
    const newValue = e.target.value;
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
    const data = {
      receipt_number: editConsultation.receipt_number,
      patient_id: editConsultation.patient.id,
      is_free: editConsultation.is_free,
      discount: parseFloat(editConsultation.discount),
      medication_prescribed: editConsultation.medication_prescribed,
      notation: editConsultation.notation,
    };
    console.log("рядок", data);

    const url = `/consultations/${editConsultation.id}`;
    $api
      .put(url, data)
      .then((response) => {
        toast.success("Консультація успішно оновлена");
        console.log("Успішно", response.data);
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
      });

    setEditModalOpen(false);
  };

  function formatDate(dateStr) {
    const parts = dateStr.split('-'); // Разбиваем строку на компоненты
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      return `${day}-${month}-${year}`; // Собираем дату в нужном формате
    }
    return dateStr; // Если формат не соответствует ожидаемому
  }

  return (
    <div className="cons-big-container">
      <SortConsultatuon data={setData} showUserSearchButton={false}/>
      <div className="cons-big-container-data">
        {Object.keys(data).map((date) => (
          <div key={date}>
            <h2 className="cons-big-container-title-date">{formatDate(date)}</h2>
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
                        <div>
                          <p> {consultation.patient.full_name}</p>
                        </div>
                        <div>
                          <p>{consultation.patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="cons-big-container-data-size3">
                      <div
                        className="cons-big-container-data-isfree"
                        onClick={() => onInputIsFree(consultation.id, date)}
                      >
                        {consultation.is_free ? null : (
                          <i className="bx bx-check bx-md"></i>
                        )}
                      </div>
                    </td>
                    <td className="cons-big-container-data-size3">
                      <input
                        className="cons-table-edit-discount"
                        type="number"
                        value={consultation.discount}
                        onChange={(e) =>
                          onInputDiscount(e, consultation.id, date)
                        }
                      />
                    </td>
                    <td className="cons-big-container-data-size3">
                      <div
                        className="cons-big-container-data-isfree"
                        onClick={() => onInputMedPre(consultation.id, date)}
                      >
                        {consultation.medication_prescribed ? (
                          <i className="bx bx-check bx-md"></i>
                        ) : null}
                      </div>
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
