import { useState } from "react";

import { SortConsultatuon } from "../EditConsultation/SortConsultatuon";

export const StatisticsFullInfoConsultation = () => {
  const [data, setData] = useState([]);

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
      <SortConsultatuon data={setData} showUserSearchButton={true} />
      <div className="cons-big-container-data">
        {Object.keys(data).map((date) => (
          <div key={date}>
            <h2 className="cons-big-container-title-date">
              {formatDate(date)}
            </h2>
            <table className="cons-big-table-title">
              <thead>
                <tr>
                  <th className="cons-big-container-data-size1">
                    Номер талону квитанції
                  </th>
                  <th className="cons-full-data-size">Відвідувач / Хворий</th>
                  <th className="cons-full-data-size1">Лікар</th>
                  <th className="cons-full-data-size3">Оплата</th>
                  <th className="cons-full-data-size3">Виписані ліки</th>
                  <th className="cons-full-data-size2">Примітки</th>
                </tr>
              </thead>

              <tbody>
                {data[date].map((consultation) => (
                  <tr
                    key={consultation.id}
                    className="cons-big-container-data-full"
                  >
                    <td className="cons-big-container-data-size1">
                      <p className="data-receipt_number">
                        {consultation.receipt_number}
                      </p>
                    </td>
                    <td className="cons-full-data-size">
                      <div className="cons-big-container-data-patient">
                        <div>
                          <p>{consultation.patient.full_name}</p>
                        </div>
                        <div>
                          <p>{consultation.patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="cons-full-data-size1">
                      <p>{consultation.user.full_name}</p>
                    </td>
                    <td className="cons-full-data-size3">
                      <p>{consultation.payment_amount}</p>
                    </td>
                    <td className="cons-full-data-size4">
                      {consultation.medication_prescribed ? (
                        <i className="bx bx-check bx-md"></i>
                      ) : null}
                    </td>
                    <td className="cons-full-data-size2">
                      <p>{consultation.notation}</p>
                    </td>
                  </tr>
                ))}
                <tr className="cons-big-container-data-total">
                  <td className="cons-big-container-data-text1">Всього:</td>
                  <td className="cons-big-container-data-text2">
                    {data[date].length}
                  </td>
                  <td className="cons-big-container-data-text2">
                    {data[date].reduce((total, consultation) => {
                      if (consultation.user.id !== data[date][0].user.id) {
                        return total + 1;
                      } else {
                        return total;
                      }
                    }, 1)}
                  </td>
                  <td className="cons-big-container-data-text2">
                    {data[date].reduce(
                      (total, consultation) =>
                        total + parseFloat(consultation.payment_amount),
                      0
                    )}
                  </td>
                  <td className="cons-big-container-data-text2">
                    {data[date].reduce((total, consultation) => {
                      return consultation.medication_prescribed
                        ? total + 1
                        : total;
                    }, 0)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
