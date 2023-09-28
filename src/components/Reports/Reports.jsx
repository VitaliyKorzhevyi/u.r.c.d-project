import { useState } from "react";

import { CreateReports } from "../CreateReports/CreateReports";
import { EditReports } from "../EditReports/EditReports";
import { Marks } from "../Marks/Marks";
import { FullInfoReports } from "../FullInfoReports/FullInfoReports";
import { DataEditing } from "../DataEditing/DataEditing";

import { DEFAULT_ROLES, ROLES } from "../../constants/roles";

import "./Reports.css";

const AccessibleButton = ({
  id,
  roles,
  defaultRoles,
  onClick,
  children,
  userData,
  activeModal,
}) => {
  const userHasRoleAccess =
    roles.length === 0 ||
    roles.some((role) => userData.advanced_roles?.includes(role));
  const userHasDefaultRoleAccess =
    !defaultRoles || defaultRoles.includes(userData.default_role);

  if (!userHasRoleAccess || !userHasDefaultRoleAccess) return null;
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
          roles={[
            ROLES.SURGERY,
            ROLES.OPERATING,
            ROLES.ANESTHESIOLOGY,
            ROLES.RESUSCITATION,
          ]}
          onClick={openCreateModal}
          userData={userData}
          activeModal={openModal}
        >
          Створити звіт
        </AccessibleButton>

        <AccessibleButton
          id="edit"
          roles={[
            ROLES.SURGERY,
            ROLES.OPERATING,
            ROLES.ANESTHESIOLOGY,
            ROLES.RESUSCITATION,
          ]}
          onClick={openEditModal}
          userData={userData}
          activeModal={openModal}
        >
          Керування звітами
        </AccessibleButton>

        <AccessibleButton
          id="marks"
          roles={[ROLES.PHARMACY, ROLES.ACCOUNTING]}
          onClick={openMarksModal}
          userData={userData}
          activeModal={openModal}
        >
          Відмітки
        </AccessibleButton>
        <AccessibleButton
          id="dataEdit"
          roles={[]}
          onClick={openDataEditModal}
          userData={userData}
          activeModal={openModal}
        >
          Редагування даних
        </AccessibleButton>

        <AccessibleButton
          id="full-info"
          roles={[]}
          defaultRoles={[DEFAULT_ROLES.ADMIN, ROLES.HEAD_DOCTOR]}
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
      {openModal === "edit" && <EditReports onClose={closeModal} />}
      {openModal === "marks" && <Marks onClose={closeModal} />}
      {openModal === "dataEdit" && <DataEditing onClose={closeModal} />}
      {openModal === "fullInfo" && <FullInfoReports onClose={closeModal} />}
    </div>
  );
};
