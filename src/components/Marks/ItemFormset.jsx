import { useState } from "react";
import $api from "../../api/api";

import { PERMISSIONS } from "../../constants/permissions";

import "./ItemFormset.css";

import { isThreeDaysOld } from "../EditReports/СoreComponentsReports/dateUtils";

const REPORT_TYPE_NAMES = {
  operating: "Операційна",
  anesthesiology: "Анестезіологія",
  resuscitation: "Реанімація",
  surgery: "Хірургія",
};

const formatReportUrl = (id, type) => `reports/${type}/${id}`;

export const ItemFormset = ({ data, userData }) => {
  const [detailedData, setDetailedData] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);

  const [pharmacyCheck, setPharmacyCheck] = useState(false);
  const [accountingCheck, setAccountingCheck] = useState(false);

  const [backendChecksPharmacy, setBackendChecksPharmacy] = useState({});
  const [backendChecksAccounting, setBackendChecksAccounting] = useState({});

  const onItemDetailsFetch = ({ id, type }) => {
    const currentItemId = `${id}-${type}`;

    if (activeItemId === currentItemId) {
    } else {
      setActiveItemId(currentItemId);
      setPharmacyCheck({}); // Обнуляем состояние при открытии новой таблицы
      setAccountingCheck({});
    }

    setActiveItemId(currentItemId);
    setPharmacyCheck({}); // Обнуляем состояние при открытии новой таблицы
    setAccountingCheck({});

    $api
      .get(formatReportUrl(id, type))
      .then((response) => {
        setDetailedData((prevData) => ({
          ...prevData,
          [currentItemId]: response.data,
        }));
        // перебираємо строки та записуємо де є відмітка АПТЕКА
        const checkedRowsPharmacy = response.data.rows
          .filter((row) => row.mark && row.mark.type === "pharmacy")
          .reduce((acc, row) => {
            acc[row.id] = { type: type, tableId: `${id}-${type}` };
            return acc;
          }, {});
        setBackendChecksPharmacy(checkedRowsPharmacy);
        setPharmacyCheck(checkedRowsPharmacy);

        // перебираємо строки та записуємо де є відмітка БУХГАЛТЕРІЯ
        const checkedRowsAccounting = response.data.rows
          .filter((row) => row.mark && row.mark.type === "accounting")
          .reduce((acc, row) => {
            acc[row.id] = { type: type, tableId: `${id}-${type}` };
            return acc;
          }, {});
        setBackendChecksAccounting(checkedRowsAccounting);
        setAccountingCheck(checkedRowsAccounting);
      })
      .catch((error) => {
        console.error("Error fetching table:", error);
      });
  };

  //*  ВІДПРАВКА ЗНАЧЕНЬ АПТЕКИ НА БЕК
  const onCheckboxChangePharmacy = (e, rowId, reportId, reportType) => {
    const isChecked = e.target.checked;
    setPharmacyCheck((prev) => {
      if (isChecked) {
        return {
          ...prev,
          [rowId]: { type: reportType, tableId: `${reportId}-${reportType}` },
        };
      } else {
        const newState = { ...prev };
        delete newState[rowId];
        return newState;
      }
    });
    // Если данный чекбокс был отмечен на сервере, удаляем его из backendChecks
    if (backendChecksPharmacy[rowId]) {
      setBackendChecksPharmacy((prev) => {
        const newState = { ...prev };
        console.log("стейт чекбокса АПТЕКИ", newState);
        delete newState[rowId];
        return newState;
      });
    }
  };

  const sendDataToBackendPharmacy = (type, itemId) => {
    const reportId = itemId.split("-")[0];
    const rowIds = Object.keys(pharmacyCheck)
      .filter((key) => pharmacyCheck[key].type === type)
      .map(Number);

    const data = {
      report: type,
      row_ids: rowIds,
    };
    const URL = `/reports/${reportId}/pharmacy-mark`;
    console.log("data", data);
    console.log("URL", URL);
    $api
      .post(URL, data)
      .then((response) => {
        onItemDetailsFetch({ id: reportId, type: type });
        console.log("Data sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  //* ВІДПРАВКА ЗНАЧЕНЬ БУХГАЛТЕРІЇ НА БЕК
  const onCheckboxChangeAccounting = (e, rowId, reportId, reportType) => {
    const isChecked = e.target.checked;
    setAccountingCheck((prev) => {
      if (isChecked) {
        return {
          ...prev,
          [rowId]: { type: reportType, tableId: `${reportId}-${reportType}` },
        };
      } else {
        const newState = { ...prev };
        delete newState[rowId];
        return newState;
      }
    });
    
    // Если данный чекбокс был отмечен на сервере, удаляем его из backendChecks
    if (backendChecksAccounting[rowId]) {
      setBackendChecksAccounting((prev) => {
        const newState = { ...prev };
        console.log("стейт чекбокса БУХГАЛТЕРІЯ", newState);
        delete newState[rowId];
        return newState;
      });
    }
  };

  const sendDataToBackendAccounting = (type, itemId) => {
    const reportId = itemId.split("-")[0];

    const rowIds = Object.keys(accountingCheck)
      .filter((key) => accountingCheck[key].type === type)
      .map(Number);

    const data = {
      report: type,
      row_ids: rowIds,
    };
    const URL = `/reports/${reportId}/accounting-mark`;

    console.log("data", data);
    console.log("URL", URL);

    $api
      .post(URL, data)
      .then((response) => {
        onItemDetailsFetch({ id: reportId, type: type });
        console.log("Data sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const hasPharmacyPermission = userData.permissions.includes(
    PERMISSIONS.UPDATING_PHARMACY_MARKS
  );
  const hasAccountingPermission = userData.permissions.includes(
    PERMISSIONS.UPDATING_ACCOUNTING_MARKS
  );

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
                <thead></thead>
                <tbody className="text-semititle">
                  <tr>
                    <td
                      className={`size-table-formset6 ${
                        isThreeDaysOld(created_at) ? "yellow" : "green"
                      }`}
                    ></td>
                    <td className="size-table-formset">
                      <p>
                        <strong>Звіт:</strong> {REPORT_TYPE_NAMES[type] || type}
                      </p>
                    </td>
                    <td>
                      <strong>Пацієнт:</strong> {patient_full_name}
                    </td>
                    <td className="size-table-formset1">
                      <div style={{ textAlign: "center" }}>
                        <strong>№:</strong>{" "}
                        <span className="text-head-saved-forms">
                          {history_number}
                        </span>
                      </div>
                    </td>
                    <td className="semititle-size2">
                      <p>
                        <strong>Дата створення:</strong>{" "}
                        {new Date(created_at).toLocaleDateString()}
                      </p>
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
                          <div>
                            {hasPharmacyPermission &&
                            !isThreeDaysOld(currentItemDetails.created_at) ? (
                              <div className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  autoComplete="off"
                                  id={`pharmacy-${row.id}`}
                                  className="hidden-checkbox"
                                  checked={
                                    !!(
                                      pharmacyCheck[row.id] ||
                                      backendChecksPharmacy[row.id]
                                    )
                                  }
                                  onChange={(e) =>
                                    onCheckboxChangePharmacy(
                                      e,
                                      row.id,
                                      itemId,
                                      type
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`pharmacy-${row.id}`}
                                  className="custom-checkbox-label"
                                >
                                  <i
                                    className={`bx bx-check bx-md ${
                                      !!(
                                        pharmacyCheck[row.id] ||
                                        backendChecksPharmacy[row.id]
                                      )
                                        ? ""
                                        : "invisible"
                                    }`}
                                  ></i>
                                </label>
                              </div>
                            ) : (
                              <span className="static-checkmark-formset">
                                {backendChecksPharmacy[row.id] ? (
                                  <i className="bx bx-check bx-md"></i>
                                ) : (
                                  ""
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {hasAccountingPermission &&
                          !isThreeDaysOld(currentItemDetails.created_at) ? (
                            <div className="custom-checkbox">
                              <input
                                type="checkbox"
                                autoComplete="off"
                                id={`pharmacy-${row.id}`}
                                className="hidden-checkbox"
                                checked={
                                  !!(
                                    accountingCheck[row.id] ||
                                    backendChecksAccounting[row.id]
                                  )
                                }
                                onChange={(e) =>
                                  onCheckboxChangeAccounting(
                                    e,
                                    row.id,
                                    itemId,
                                    type
                                  )
                                }
                              />
                              <label
                                htmlFor={`pharmacy-${row.id}`}
                                className="custom-checkbox-label"
                              >
                                <i
                                  className={`bx bx-check bx-md ${
                                    !!(
                                      accountingCheck[row.id] ||
                                      backendChecksAccounting[row.id]
                                    )
                                      ? ""
                                      : "invisible"
                                  }`}
                                ></i>
                              </label>
                            </div>
                          ) : (
                            <span className="static-checkmark-formset">
                              {backendChecksAccounting[row.id] ? (
                                <i className="bx bx-check bx-md"></i>
                              ) : (
                                ""
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isThreeDaysOld(currentItemDetails.created_at) ? (
                  <div className="btns-table-formset">
                    {hasPharmacyPermission && (
                      <button
                        type="button"
                        className="btn-save-table-formset"
                        onClick={() => sendDataToBackendPharmacy(type, itemId)}
                      >
                        Зберегти
                      </button>
                    )}

                    {hasAccountingPermission && (
                      <button
                        type="button"
                        className="btn-save-table-formset"
                        onClick={() =>
                          sendDataToBackendAccounting(type, itemId)
                        }
                      >
                        Зберегти
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};
