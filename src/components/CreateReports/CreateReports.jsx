//todo Прописати валідацію для форм, потрбіно що мінімально буі 1 рядок а максимально 100
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ReportsAnesthesiology } from "./ReportsAnesthesiology";
import { ReportsOperating } from "./ReportsOperating";
import { ReportsResuscitation } from "./ReportsResuscitation";
import { ReportsSurgical } from "./ReportsSurgical";
import { ReportsConsultation } from "./ReportsConsultation";

import { ROLES } from "../../constants/roles";

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
      roles: [ROLES.ANESTHESIOLOGY],
    },
    {
      id: "operating",
      label: "Операційна",
      component: ReportsOperating,
      roles: [ROLES.OPERATING],
    },
    {
      id: "resuscitation",
      label: "Реанімація",
      component: ReportsResuscitation,
      roles: [ROLES.RESUSCITATION],
    },
    {
      id: "surgical",
      label: "Хірургія",
      component: ReportsSurgical,
      roles: [ROLES.SURGERY],
    },
    {
      id: "consultation",
      label: "Консультація",
      component: ReportsConsultation,
      roles: [
        ROLES.SURGERY,
        ROLES.OPERATING,
        ROLES.ANESTHESIOLOGY,
        ROLES.RESUSCITATION,
      ],
    },
  ];

  const userHasAccess = (form) => {
    if (!form.roles) return true;
    return form.roles.some((role) => userData.advanced_roles?.includes(role));
  };

  const userHasAnyAccess = FORMS_DATA.some(userHasAccess);

  return (
    userHasAnyAccess ? (
      <div>
        <div className="forms-header">
          <ul className="forms-btns-list">
            {FORMS_DATA.map(
              (form) =>
                userHasAccess(form) && (
                  <li key={form.id}>
                    <button
                      type="button"
                      onClick={() => onFormChange(form.id)}
                      className={`base-style-btns-forms ${
                        activeForm === form.id ? "active-btn-forms" : ""
                      }`}
                    >
                      {form.label}
                    </button>
                  </li>
                )
            )}
          </ul>
        </div>
        {FORMS_DATA.map(
          (form) =>
            activeForm === form.id && userHasAccess(form) && <form.component />
        )}
      </div>
    ) : null 
  );
};
