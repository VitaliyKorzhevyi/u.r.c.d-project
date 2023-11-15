import { useState } from "react";
import $api from "../../api/api";

const REPORT_TYPE_NAMES = {
  operating: "Операційна",
  anesthesiology: "Анестезіологія",
  resuscitation: "Реанімація",
  surgery: "Хірургія",
};

const formatReportUrl = (id, type) => `reports/${type}/${id}`;

export const ArchiveItem = ({ data, userData }) => {
  const [detailedData, setDetailedData] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);

  const onItemDetailsFetch = ({ id, type }) => {
    const currentItemId = `${id}-${type}`;
    setActiveItemId(currentItemId);

    $api
      .get(formatReportUrl(id, type))
      .then((response) => {
        setDetailedData((prevData) => ({
          ...prevData,
          [currentItemId]: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching table:", error);
      });
  };

  const currentItemDetails = detailedData[activeItemId];

  return (
    <ul className="list-formset">
      {data.map((item) => {
        const { id, type, patient_full_name, history_number, created_at } =
          item;
        const itemId = `${id}-${type}`;
        return (
          <li key={itemId} className="item-formset">
            <div className="mini-form">
              <table>
                <tbody className="text-semititle">
                  <tr>
                    <td className="size-table-formset">
                      <p>{REPORT_TYPE_NAMES[type] || type}</p>
                    </td>
                    <td>{patient_full_name}</td>

                    <td className="size-table-formset1">
                      <div style={{ textAlign: "center" }}>
                        <span className="text-head-saved-forms">
                          {history_number}
                        </span>
                      </div>
                    </td>
                    <td className="semititle-size2">
                      <p>{new Date(created_at).toLocaleDateString()}</p>
                    </td>
                    <td
                      className="semititle-size4"
                      onClick={() => onItemDetailsFetch(item)}
                    >
                      <i
                        className={`bx ${
                          activeItemId === itemId
                            ? "bx-refresh bx-sm"
                            : "bxs-chevron-down bx-sm"
                        }`}
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {activeItemId === itemId && currentItemDetails && (
              <div className="detailed-table-data active">
                <table className="item-formset-table">
                  <thead>
                    <tr>
                      <th colSpan="6">
                        <p>
                          <strong>Звітував:</strong>{" "}
                          <span className="text-size">
                            {currentItemDetails.creator.full_name} (
                            {currentItemDetails.creator.job_title})
                          </span>
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3">
                        <p>
                          <strong>Дата народження пацієнта:</strong>{" "}
                          {currentItemDetails.patient.birthday
                            .split("-")
                            .reverse()
                            .join(".")}
                        </p>
                      </td>
                      <td colSpan="3">
                        <p>
                          <strong>К-сть днів:</strong>{" "}
                          {currentItemDetails.preoperative_day.title}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6">
                        <p>
                          <strong>Діагноз:</strong>{" "}
                          {currentItemDetails.diagnosis &&
                            currentItemDetails.diagnosis.title}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6">
                        <p>
                          <strong>Операція:</strong>{" "}
                          {currentItemDetails.operation.title}
                        </p>
                      </td>
                    </tr>
                    <tr className="semi-head">
                      <td>
                        <p>
                          <strong>Назва препарату</strong>
                        </p>
                      </td>
                      <td className="size-table-formset2">
                        <strong>К-сть.</strong>
                      </td>
                      <td className="size-table-formset3">
                        <strong>Тип</strong>
                      </td>
                      <td>
                        <strong>Примітки</strong>
                      </td>
                      <td className="size-table-formset4">
                        <strong>Апт.</strong>
                      </td>
                      <td className="size-table-formset4">
                        <strong>Бух.</strong>
                      </td>
                    </tr>
                    {currentItemDetails.rows.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <span className="text-head-saved-forms">
                            {row.medicament.title}
                          </span>
                        </td>
                        <td>
                          <p
                            className="text-head-saved-forms"
                            style={{ textAlign: "center" }}
                          >
                            {row.quantity_of_medicament}
                          </p>
                        </td>
                        <td>
                          <p
                            className="text-head-saved-forms"
                            style={{ textAlign: "center" }}
                          >
                            {row.unit_of_measurement}
                          </p>
                        </td>
                        <td>
                          <p className="text-head-saved-forms">
                            {row.notation}
                          </p>
                        </td>
                        <td>
                          <span className="static-checkmark-formset">
                            {row.mark && row.mark.type === "pharmacy" ? (
                              <i className="bx bx-check bx-md"></i>
                            ) : (
                              ""
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="static-checkmark-formset">
                            {row.mark && row.mark.type === "accounting" ? (
                              <i className="bx bx-check bx-md"></i>
                            ) : (
                              ""
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
