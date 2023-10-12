export const PERMISSIONS = {
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  VIEW_USER: "view_user",
  BAN_N_UNBAN_USER: "ban_n_unban_user",
  CHANGE_USER_ROLES: "change_user_roles",
  CREATE_INFORMATION_MESSAGES: "create_information_messages",
  VIEW_INFORMATION_MESSAGES: "view_information_messages",

  CREATE_GENERAL_MESSAGES: "create_general_messages",
  VIEW_GENERAL_MESSAGES: "view_general_messages",
  CREATE_PREOPERATIVE_DAY: "create_preoperative_day",

  EDIT_PREOPERATIVE_DAY: "edit_preoperative_day",

  CREATE_DIAGNOSIS: "create_diagnosis",

  EDIT_DIAGNOSIS: "edit_diagnosis",
  CREATE_MEDICAMENT: "create_medicament",

  EDIT_MEDICAMENT: "edit_medicament",
  STATISTICS_MEDICAMENT: "statistics_medicament",
  CREATE_OPERATION: "create_operation",

  EDIT_OPERATION: "edit_operation",
  CREATE_PATIENT: "create_patient",

  EDIT_PATIENT: "edit_patient",
  SEARCH_MY_REPORTS: "search_my_reports",
  SEARCH_ALL_REPORTS: "search_all_reports",
  UPDATING_PHARMACY_MARKS: "updating_pharmacy_marks",
  UPDATING_ACCOUNTING_MARKS: "updating_accounting_marks",
  CREATE_ANESTHESIOLOGY_REPORT: "create_anesthesiology_report",
  EDIT_ANESTHESIOLOGY_REPORT: "edit_anesthesiology_report",
  CREATE_OPERATING_REPORT: "create_operating_report",
  EDIT_OPERATING_REPORT: "edit_operating_report",
  CREATE_RESUSCITATION_REPORT: "create_resuscitation_report",
  EDIT_RESUSCITATION_REPORT: "edit_resuscitation_report",
  CREATE_SURGERY_REPORT: "create_surgery_report",
  EDIT_SURGERY_REPORT: "edit_surgery_report",
};

export const SECTION_PERMISSIONS = {
  "main-page": [], 
  users: [
    PERMISSIONS.VIEW_USER,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.BAN_N_UNBAN_USER,
    PERMISSIONS.CHANGE_USER_ROLES,
  ],
  reports: [],
  statistics: [PERMISSIONS.STATISTICS_MEDICAMENT],
  chat: [], 

  "create-report": [
    PERMISSIONS.CREATE_ANESTHESIOLOGY_REPORT,
    PERMISSIONS.CREATE_OPERATING_REPORT,
    PERMISSIONS.CREATE_RESUSCITATION_REPORT,
    PERMISSIONS.CREATE_SURGERY_REPORT,
  ],

  "edit-report": [
    PERMISSIONS.EDIT_ANESTHESIOLOGY_REPORT,
    PERMISSIONS.EDIT_OPERATING_REPORT,
    PERMISSIONS.EDIT_RESUSCITATION_REPORT,
    PERMISSIONS.EDIT_SURGERY_REPORT,
  ],

  "marks-report": [
    PERMISSIONS.UPDATING_PHARMACY_MARKS,
    PERMISSIONS.UPDATING_ACCOUNTING_MARKS,
  ],

  "edit-data": [
    PERMISSIONS.EDIT_PREOPERATIVE_DAY,
    PERMISSIONS.EDIT_DIAGNOSIS,
    PERMISSIONS.EDIT_MEDICAMENT,
    PERMISSIONS.EDIT_OPERATION,
    PERMISSIONS.EDIT_PATIENT,
  ],

  "full-info-report": [
    PERMISSIONS.SEARCH_ALL_REPORTS,
  ],

};
