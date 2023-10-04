import { useState } from "react";

import { CreateReports } from "../CreateReports/CreateReports";
import { EditReports } from "../EditReports/EditReports";
import { Marks } from "../Marks/Marks";
import { FullInfoReports } from "../FullInfoReports/FullInfoReports";
import { DataEditing } from "../DataEditing/DataEditing";


import { SECTION_PERMISSIONS } from "../../constants/permissions";

import "./Reports.css";

const AccessibleButton = ({
  id,
  section,
  onClick,
  children,
  userData,
  activeModal,
}) => {
  const requiredPermissions = SECTION_PERMISSIONS[section];

 
  const userHasPermission = requiredPermissions.some((permission) =>
    userData.permissions?.includes(permission)
  );

  if (!userHasPermission) return null;

  const buttonClass = `base-style-btns-reports ${
    activeModal === id ? "active-btn-reports" : ""
  }`;

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export const Reports = ({ userData }) => {
  const [openModal, setOpenModal] = useState(null);

  const openCreateModal = () => setOpenModal("create");
  const openEditModal = () => setOpenModal("edit");
  const openMarksModal = () => setOpenModal("marks");
  const openDataEditModal = () => setOpenModal("dataEdit");
  const openFullInfoModal = () => setOpenModal("fullInfo");
  const closeModal = () => setOpenModal(null);

  return (
    <div className="reports-container">
      <div className="reports-buttons">
        <AccessibleButton
          id="create"
          section="create-report"
          onClick={openCreateModal}
          userData={userData}
          activeModal={openModal}
        >
          Створити звіт
        </AccessibleButton>
 
        <AccessibleButton
          id="edit"
          section="edit-report"
          onClick={openEditModal}
          userData={userData}
          activeModal={openModal}
        >
          Керування звітами
        </AccessibleButton>

        <AccessibleButton
          id="marks"
          section="marks-report"
          onClick={openMarksModal}
          userData={userData}
          activeModal={openModal}
        >
          Відмітки
        </AccessibleButton>
        <AccessibleButton
          id="dataEdit"
          section="edit-data"
          onClick={openDataEditModal}
          userData={userData}
          activeModal={openModal}
        >
          Редагування даних
        </AccessibleButton>

        <AccessibleButton
          id="full-info"
          section="full-info-report"
          onClick={openFullInfoModal}
          userData={userData}
          activeModal={openModal}
        >
          Статистика по звітам
        </AccessibleButton>
      </div>

      {/* Модальные окна */}
      {openModal === "create" && (
        <CreateReports userData={userData} onClose={closeModal} />
      )}
      {openModal === "edit" && <EditReports onClose={closeModal} userData={userData}/>}
      {openModal === "marks" && <Marks userData={userData} onClose={closeModal} />}
      {openModal === "dataEdit" && <DataEditing onClose={closeModal} />}
      {openModal === "fullInfo" && <FullInfoReports onClose={closeModal} />}
    </div>
  );
};
