//todo Прописати валідацію для форм, потрбіно що мінімально буі 1 рядок а максимально 100
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ReportsAnesthesiology } from "./ReportsAnesthesiology";
import { ReportsOperating } from "./ReportsOperating";
import { ReportsResuscitation } from "./ReportsResuscitation";
import { ReportsSurgical } from "./ReportsSurgical";
import { ReportsConsultation } from "./ReportsConsultation";

import { PERMISSIONS } from "../../constants/permissions";

import "./CreateReports.css";

export const CreateReports = ({ userData }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialForm = params.get("form") || "anesthesiology";
  const [activeForm, setActiveForm] = useState(initialForm);

  const onFormChange = (form) => {
    setActiveForm(form);
    const newUrl = `${window.location.pathname}?form=${form}`;
    window.history.replaceState(null, "", newUrl);
  };

  useEffect(() => {
    const currentForm =
      new URLSearchParams(location.search).get("form") || "anesthesiology";
    setActiveForm(currentForm);
  }, [location.search]);

  const FORMS_DATA = [
    {
      id: "anesthesiology",
      label: "Анестезіологія",
      component: ReportsAnesthesiology,
      permissions: [PERMISSIONS.CREATE_ANESTHESIOLOGY_REPORT]
    },
    {
      id: "operating",
      label: "Операційна",
      component: ReportsOperating,
      permissions: [PERMISSIONS.CREATE_OPERATING_REPORT]
    },
    {
      id: "resuscitation",
      label: "Реанімація",
      component: ReportsResuscitation,
      permissions: [PERMISSIONS.CREATE_RESUSCITATION_REPORT]
    },
    {
      id: "surgical",
      label: "Хірургія",
      component: ReportsSurgical,
      permissions: [PERMISSIONS.CREATE_SURGERY_REPORT]
    },
    {
      id: "consultation",
      label: "Консультація",
      component: ReportsConsultation,
      permissions: []
    },
  ];

  const userHasAccess = (form) => {
    if (!form.permissions) return true;
    return form.permissions.some((permissions) => userData.permissions?.includes(permissions));
  };

  const userHasAnyAccess = FORMS_DATA.some(userHasAccess);


  return userHasAnyAccess ? (
    <div className="container-create-reports">
      <div className="forms-header">
        <p>Тип звіту:</p>
        <select
          value={activeForm}
          onChange={(e) => onFormChange(e.target.value)}
          className="list-create-reports"
        >
          {FORMS_DATA.map(
            (form) =>
              userHasAccess(form) && (
                <option key={form.id} value={form.id} className="item-create-reports">
                  {form.label}
                </option>
              )
          )}
        </select>
      </div>
      {FORMS_DATA.map(
        (form) =>
          activeForm === form.id && userHasAccess(form) && (
            <form.component key={form.id} />
          )
      )}
    </div>
  ) : null;
};
