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
          return { ...consultation, patient: updatedPatient };
        }
        return consultation;
      }
    );
    updatedData[selectedDate] = updatedConsultations;
    setData(updatedData);
  };

  //* РЕДАГУВАННЯ ЗНИЖКИ
  const onInputDiscount = (e, id, date) => {
    let newValue = parseInt(e.target.value);

    if (!isNaN(newValue) && newValue >= 0) {
      newValue = e.target.value;
    } else {
      newValue = 0;
    }

    const updatedData = { ...data };
    const updatedConsultations = updatedData[date].map((consultation) => {
      if (consultation.id === id) {
        return { ...consultation, payment_amount: newValue };
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
      receipt_number: editConsultation.receipt_number || null,
      patient_id: editConsultation.patient.id,
      payment_amount: parseFloat(editConsultation.payment_amount || 0),
      medication_prescribed: editConsultation.medication_prescribed,
      notation: editConsultation.notation || null,
    };

    const url = `/consultations/${editConsultation.id}`;
    $api
      .put(url, data)
      .then((response) => {
        toast.success("Консультація успішно оновлена");
      })
      .catch((error) => {
        console.error("Произошла ошибка:", error);
      });

    setEditModalOpen(false);
  };

  function formatDate(dateStr) {
    const parts = dateStr.split("-"); // Разбиваем строку на компоненты
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
      <SortConsultatuon data={setData} showUserSearchButton={false} />
      <div className="cons-big-container-data">
        {Object.keys(data).map((date) => (
          <div key={date}>
            <h2 className="cons-big-container-title-date">
              {formatDate(date)}
            </h2>
            <table className="cons-big-table-title">
              <thead>
                <tr>
                  <th className="cons-big-container-data-size"></th>
                  <th className="cons-big-container-data-size1">
                    Номер талону квитанції
                  </th>
                  <th className="cons-big-container-data-size2">
                    відвідувач/хворий
                  </th>
                  <th className="cons-big-container-data-size3">Оплата</th>
                  <th className="cons-big-container-data-size6">
                    Виписані ліки
                  </th>
                  <th className="cons-big-container-data-size4">Примітки</th>
                  <th className="cons-big-container-data-size5">Дії</th>
                </tr>
              </thead>

              <tbody>
                {data[date].map((consultation) => {
                  const {
                    id,
                    is_edit,
                    receipt_number,
                    patient,
                    payment_amount,
                    medication_prescribed,
                    notation,
                  } = consultation;

                  return (
                    <tr key={id}>
                      <td
                        className={`cons-big-container-data-size ${
                          is_edit ? "green" : "yellow"
                        }`}
                      ></td>
                      <td className="cons-big-container-data-size1">
                        {is_edit ? (
                          <input
                          maxLength={10}
                            className="cons-table-edit-rec-n"
                            type="text"
                            value={receipt_number || null}
                            onChange={(e) => onInputReceiptNumber(e, id, date)}
                          />
                        ) : (
                          <span>{receipt_number || null}</span>
                        )}
                      </td>
                      <td className="cons-big-container-data-size2">
                        <div className="cons-big-container-data-patient">
                          <div>
                            <p> {patient.full_name}</p>
                          </div>
                          <div>
                            <p>{patient.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="cons-big-container-data-size3">
                        {is_edit ? (
                          <input
                            className="cons-table-edit-discount"
                            type="number"
                            value={payment_amount === 0 ? 0 : payment_amount}
                            onChange={(e) => onInputDiscount(e, id, date)}
                          />
                        ) : (
                          <span className="cons-table-edit-discount-value">
                            {payment_amount || ""}
                          </span>
                        )}
                      </td>
                      <td className="cons-big-container-data-size6">
                        {is_edit ? (
                          <div
                            className="cons-big-container-data-isfree"
                            onClick={() => onInputMedPre(id, date)}
                          >
                            {medication_prescribed ? (
                              <i className="bx bx-check bx-md"></i>
                            ) : null}
                          </div>
                        ) : (
                          <span>
                            {medication_prescribed ? (
                              <i className="bx bx-check bx-md"></i>
                            ) : null}
                          </span>
                        )}
                      </td>
                      <td className="cons-big-container-data-size4">
                        {is_edit ? (
                          <textarea
                            className="cons-table-edit-notation"
                            type="text"
                            value={notation || null}
                            onChange={(e) => onInputNotation(e, id, date)}
                            maxLength={500}
                          />
                        ) : (
                          <span>{notation || null}</span>
                        )}
                      </td>
                      <td className="cons-big-container-data-size5">
                        <div
                          className={`cons-big-container-data-btns ${
                            is_edit ? "" : "disabled"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              toggleModalSearch(id, date);
                            }}
                            disabled={!is_edit}
                          >
                            <i className="bx bx-user bx-sm"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(consultation)}
                            disabled={!is_edit}
                          >
                            <i className="bx bx-edit-alt bx-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="cons-big-container-data-total">
                  <td></td>
                  <td className="cons-big-container-data-text1">Всіх:</td>
                  <td className="cons-big-container-data-text2">
                    {data[date].length}
                  </td>
                  <td className="cons-big-container-data-text2">
                  </td>
                  <td className="cons-big-container-data-text2">
                  </td>
                  <td></td>
                  <td></td>
                </tr>
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
