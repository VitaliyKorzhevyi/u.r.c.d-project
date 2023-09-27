import React from "react";

import "./ReportsConsultation.css";
export const ReportsConsultation = () => {
  return (
    <div className="consultation-table">
      <div className="form2-icons">
        <i className="bx bx-lock-open-alt bx-sm form1-icon"></i>
        <i className="bx bx-copy bx-sm form1-copy"></i>
        <i className="bx bx-trash bx-sm form1-delete"></i>
      </div>

      <table>
        <thead>
          <tr>
            <th colSpan="7" className="consultation-table-title">
              Консультація
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};
