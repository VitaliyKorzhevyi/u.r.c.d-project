import React from "react";

import { CreateReports } from "../CreateReports/CreateReports";
import { EditReports } from "../EditReports/EditReports";

import "./Reports.css";

export const Reports = ({userData}) => {
  return (
    <div>
      <CreateReports userData={userData}/>
      <EditReports />
    </div>
  );
};
