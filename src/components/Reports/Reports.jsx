import { useState, useContext} from "react";

import { CreateReports } from "../CreateReports/CreateReports";
import { EditReports } from "../EditReports/EditReports";
import { EditConsultation } from "../EditConsultation/EditConsultation";
import { Marks } from "../Marks/Marks";
// import { FullInfoReports } from "../FullInfoReports/FullInfoReports";
import { DataEditing } from "../DataEditing/DataEditing";
import { UserDataContext } from "../../pages/HomePage";

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

export const Reports = () => {
  const { myData } = useContext(UserDataContext);
  const [openModal, setOpenModal] = useState(null);

  const openCreateModal = () => 
    setOpenModal("create");
  ;
  const openEditModal = () => setOpenModal("edit");
  const openEditConsModal = () => setOpenModal("editCons");
  const openMarksModal = () => setOpenModal("marks");
  const openDataEditModal = () => setOpenModal("dataEdit");
  // const openFullInfoModal = () => setOpenModal("fullInfo");
  const closeModal = () => setOpenModal(null);


  return (
    <div className="reports-container">
      <div className="reports-buttons">
        <AccessibleButton
          id="create"
          section="create-report"
          onClick={openCreateModal}
          userData={myData}
          activeModal={openModal}
        >
          Створити звіт
        </AccessibleButton>
 
        <AccessibleButton
          id="edit"
          section="edit-report"
          onClick={openEditModal}
          userData={myData}
          activeModal={openModal}
        >
          Керування звітами
        </AccessibleButton>
        <AccessibleButton
          id="editCons"
          section="edit-consultation"
          onClick={openEditConsModal}
          userData={myData}
          activeModal={openModal}
        >
          Керування консультаціями
        </AccessibleButton>
        <AccessibleButton
          id="marks"
          section="marks-report"
          onClick={openMarksModal}
          userData={myData}
          activeModal={openModal}
        >
          Відмітки
        </AccessibleButton>
        <AccessibleButton
          id="dataEdit"
          section="edit-data"
          onClick={openDataEditModal}
          userData={myData}
          activeModal={openModal}
        >
          Редагування даних
        </AccessibleButton>

        {/* <AccessibleButton
          id="full-info"
          section="full-info-report"
          onClick={openFullInfoModal}
          userData={myData}
          activeModal={openModal}
        >
          Архів звітів
        </AccessibleButton> */}
      </div>

      {/* Модальные окна */}
      {openModal === "create" && (
        <CreateReports userData={myData} onClose={closeModal} />
      )}
      {openModal === "edit" && <EditReports onClose={closeModal} userData={myData}/>}
      {openModal === "editCons" && <EditConsultation onClose={closeModal}/>}
      {openModal === "marks" && <Marks userData={myData} onClose={closeModal} />}
      {openModal === "dataEdit" && <DataEditing onClose={closeModal} />}
      {/* {openModal === "fullInfo" && <FullInfoReports onClose={closeModal} />} */}
    </div>
  );
};
