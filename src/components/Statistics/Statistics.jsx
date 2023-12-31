import { useState, useContext} from "react";
import { UserDataContext } from "../../pages/HomePage";

import { StatisticsMedicaments } from './StatisticsMedicaments'
import { StatisticsConsultation } from './StatisticsConsultation'
import { StatisticsFullInfoConsultation } from './StatisticsFullInfoConsultation'
import { Archive } from "./Archive";

import "./Statistics.css";


const AccessibleButton = ({
  id,
  onClick,
  children,
  activeModal,
}) => {
  const buttonClass = `base-style-btns-reports ${
    activeModal === id ? "active-btn-reports" : ""
  }`;

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export const Statistics = () => {
  const userData = useContext(UserDataContext);
  const [openModal, setOpenModal] = useState(null);


  const openMedModal = () => setOpenModal("st-medicam");
  const openConsModal = () => setOpenModal("st-consul");
  const openFullInfoModal = () => setOpenModal("st-fullInfo");
  const openArchiveModal = () => setOpenModal("archive");
  const closeModal = () => setOpenModal(null);


  return (
    <div className="reports-container">
      <div className="reports-buttons">
        <AccessibleButton
          id="st-medicam"
          onClick={openMedModal}
          userData={userData}
          activeModal={openModal}
        >
          Статистика медикаментів
        </AccessibleButton>
 
        <AccessibleButton
          id="st-consul"
          onClick={openConsModal}
          userData={userData}
          activeModal={openModal}
        >
          Зведена інформація
        </AccessibleButton>

        <AccessibleButton
          id="st-fullInfo"
          onClick={openFullInfoModal}
          userData={userData}
          activeModal={openModal}
        >
          Детальний пошук
        </AccessibleButton>
        <AccessibleButton
          id="archive"
          onClick={openArchiveModal}
          userData={userData}
          activeModal={openModal}
        >
          Звіти по медикаментам
        </AccessibleButton>
        </div>
      {openModal === "st-medicam" && <StatisticsMedicaments onClose={closeModal} />}
      {openModal === "st-consul" && <StatisticsConsultation  onClose={closeModal} />}
      {openModal === "st-fullInfo" && <StatisticsFullInfoConsultation onClose={closeModal} />}
      {openModal === "archive" && <Archive onClose={closeModal} />}
    </div>
  );
};
