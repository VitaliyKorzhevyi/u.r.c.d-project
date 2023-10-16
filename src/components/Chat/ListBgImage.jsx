import { useState } from "react";
import chatBgImage from "../../image/chat-bg.jpg";
import chatBgImage1 from "../../image/chat-bg1.jpg";
import chatBgImage2 from "../../image/chat-bg2.jpg";
import chatBgImage3 from "../../image/chat-bg3.jpg";
import chatBgImage4 from "../../image/chat-bg4.jpg";
import chatBgImage5 from "../../image/chat-bg5.jpg";
import chatBgImage6 from "../../image/chat-bg6.jpg";
import chatBgImage7 from "../../image/chat-bg7.jpg";
import chatBgImage9 from "../../image/chat-bg9.jpg";
import chatBgImage10 from "../../image/chat-bg10.jpg";
import chatBgImage11 from "../../image/chat-bg11.jpg";
import chatBgImage12 from "../../image/chat-bg12.jpg";
import chatBgImage13 from "../../image/chat-bg13.jpg";
import chatBgImage14 from "../../image/chat-bg14.jpg";
import chatBgImage15 from "../../image/chat-bg15.jpg";
import chatBgImage16 from "../../image/chat-bg16.jpg";
import chatBgImage17 from "../../image/chat-bg17.jpg";
import chatBgImage18 from "../../image/chat-bg18.jpg";
import chatBgImage19 from "../../image/chat-bg19.jpg";
import chatBgImage20 from "../../image/chat-bg20.jpg";
import chatBgImage21 from "../../image/chat-bg21.jpg";
import chatBgImage22 from "../../image/chat-bg22.jpg";
import chatBgImage23 from "../../image/chat-bg23.jpg";
import chatBgImage24 from "../../image/chat-bg24.jpg";
import chatBgImage25 from "../../image/chat-bg25.jpg";


export const ListBgImage = ({ onBackgroundChange }) => {



  const backgroundOptions = [
    { id: "1", name: "Світлий", url: chatBgImage },
    { id: "2", name: "Фіолетовий", url: chatBgImage6 },
    { id: "3", name: "Темно-синій", url: chatBgImage7 },
    { id: "4", name: "Синій", url: chatBgImage9 },
    { id: "5", name: "Темний", url: chatBgImage10 },
    { id: "6", name: "Манговий", url: chatBgImage15 },
    { id: "7", name: "Бамбуковий", url: chatBgImage24 },
    { id: "8", name: "Рожевий", url: chatBgImage22 },
    { id: "9", name: "Захід", url: chatBgImage25 },
    { id: "10", name: "Самотній рибалка", url: chatBgImage18 },
    { id: "11", name: "Повітряні ліхтарі", url: chatBgImage11 },
    { id: "12", name: "Різдвяний вінок", url: chatBgImage23 },
    { id: "13", name: "Вечірня прогулянка", url: chatBgImage21 },
    { id: "14", name: "Льодовий шлях", url: chatBgImage20 },
    { id: "15", name: "Миттєвість", url: chatBgImage19 },
    { id: "16", name: "Птеродактиль", url: chatBgImage12 },
    { id: "17", name: "Єнот", url: chatBgImage13 },
    { id: "18", name: "Зимні гори", url: chatBgImage14 },
    { id: "19", name: "Ліхтар", url: chatBgImage16 },
    { id: "20", name: "Природа", url: chatBgImage1 },
    { id: "21", name: "Метелик", url: chatBgImage2 },
    { id: "22", name: "Зачарований світ", url: chatBgImage3 },
    { id: "23", name: "Вечоріє", url: chatBgImage4 },
    { id: "24", name: "Полумяний захід", url: chatBgImage5 },
    { id: "25", name: "Човен", url: chatBgImage17 },
  ];
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0].url);
  const handleBackgroundChange = (event) => {
    const selectedBackgroundId = event.target.value;
    const selectedBackground = backgroundOptions.find(
      (option) => option.id === selectedBackgroundId
    );
    setSelectedBackground(selectedBackground.url);
    onBackgroundChange(selectedBackground.url);

    localStorage.setItem("selectedBackground", selectedBackground.url);
  };

  return (
    <div>
      <select
        onChange={handleBackgroundChange}
        value={selectedBackground.id}
      >
        <option className="defoult-opt-bg-chat" disabled>Обрати фон</option>
        {backgroundOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
