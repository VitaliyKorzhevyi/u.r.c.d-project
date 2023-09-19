//todo Прописати валідацію для форм, потрбіно що мінімально буі 1 рядок а максимально 100
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FormAnesthesiology } from "./FormAnesthesiology";
import { FormOperating } from "./FormOperating";
import { FormResuscitation } from "./FormResuscitation";
import { FormSurgical } from "./FormSurgical";
import { FormConsultation } from "./FormConsultation";

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
          <button type="button" onClick={() => onFormChange('operating')}>Операційна</button>
          <button type="button" onClick={() => onFormChange('resuscitation')}>Реанімація</button>
          <button type="button" onClick={() => onFormChange('surgical')}>Хірургія</button>
          <button type="button" onClick={() => onFormChange('consultation')}>Консультація</button>
        </div>
      </div>
      {activeForm === 'anesthesiology' && <FormAnesthesiology />}
      {activeForm === 'operating' && <FormOperating />}
      {activeForm === 'resuscitation' && <FormResuscitation />}
      {activeForm === 'surgical' && <FormSurgical />}
      {activeForm === 'consultation' && <FormConsultation />}
    </div>
  );
};
