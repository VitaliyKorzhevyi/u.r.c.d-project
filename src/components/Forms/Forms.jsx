//todo Прописати валідацію для форм, потрбіно що мінімально буі 1 рядок а максимально 100
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FormAnesthesiology } from "./FormAnesthesiology";
import { FormOperating } from "./FormOperating";
import { FormResuscitation } from "./FormResuscitation";
import { FormSurgical } from "./FormSurgical";
import { FormConsultation } from "./FormConsultation";

import "./Forms.css";

export const Forms = () => {
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
    { id: 'anesthesiology', label: 'Анестезіологія', component: FormAnesthesiology },
    { id: 'operating', label: 'Операційна', component: FormOperating },
    { id: 'resuscitation', label: 'Реанімація', component: FormResuscitation },
    { id: 'surgical', label: 'Хірургія', component: FormSurgical },
    { id: 'consultation', label: 'Консультація', component: FormConsultation },
  ];

  return (
    <div>
      <div className="forms-header">
        <ul className="forms-btns-list">
        {FORMS_DATA.map(form => (
      <li key={form.id}>
        <button
          type="button"
          onClick={() => onFormChange(form.id)}
          className={`base-style-btns-forms ${activeForm === form.id ? "active-btn-forms" : ""}`}
        >
          {form.label}
        </button>
      </li>
    ))}
        </ul>
      </div>
      {activeForm === "anesthesiology" && <FormAnesthesiology />}
      {activeForm === "operating" && <FormOperating />}
      {activeForm === "resuscitation" && <FormResuscitation />}
      {activeForm === "surgical" && <FormSurgical />}
      {activeForm === "consultation" && <FormConsultation />}
    </div>
  );
};
