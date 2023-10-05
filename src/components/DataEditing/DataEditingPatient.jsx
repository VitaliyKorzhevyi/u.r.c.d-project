import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import $api from "../../api/api";

export const DataEditingPatient = ({ patientData }) => {
  const [first_name, setFirstName] = useState(patientData.first_name);
  const [last_name, setLastName] = useState(patientData.last_name);
  const [middle_name, setMiddleName] = useState(patientData.middle_name);
  const [birthday, setBirthday] = useState(patientData.birthday);
  const [phone, setPhone] = useState(patientData.phone);
  const [email, setEmail] = useState(patientData.email || "");

  useEffect(() => {
    setFirstName(patientData.first_name || "");
    setLastName(patientData.last_name || "");
    setMiddleName(patientData.middle_name || "");
    setBirthday(patientData.birthday || "");
    setPhone(patientData.phone || "");
    setEmail(patientData.email || "");
  }, [patientData]);

  console.log("Прийшло", first_name);

  const onCreateUser = () => {
    const data = {
      first_name: first_name,
      last_name: last_name,
      middle_name: middle_name,
      birthday: birthday,
      phone: phone || null,
      email: email || null,
    };

    const fieldNames = {
        first_name: "Ім'я",
        last_name: "Призвіще",
        middle_name: "По-батькові",
        birthday: "Дата народження"
      };
    
      for (const [key, value] of Object.entries(fieldNames)) {
        if (!data[key]) {
          toast.warn(`Поле '${value}' не може бути порожнім`);
          return;
        }
      }

    const patientId = patientData.id;
    const URL = `/patients/${patientId}`;
    console.log("Оновлення пацієнта", URL, data);
    $api
      .put(URL, data)
      .then((response) => {
        console.log(response);

          toast.success(`Дані користувача успішно оновлено`, {
            autoClose: 1500,
          });
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreateUser();
        }}
      >
        <div>
          <label>
            Призвіще:
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(capitalize(e.target.value))}
            />
          </label>
          <label>
            Ім'я:
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(capitalize(e.target.value))}
            />
          </label>
          <label>
            По-батькові:
            <input
              type="text"
              value={middle_name}
              onChange={(e) => setMiddleName(capitalize(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            Дата народження:
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </label>
          <label>
            Телефон:
            <input
              type="phone"
              value={phone}
              onChange={(e) => {
                if (/^[+\d]+$/.test(e.target.value)) {
                  if (e.target.value[0] !== "+") {
                    setPhone("+" + e.target.value);
                  } else {
                    setPhone(e.target.value);
                  }
                }
              }}
            />
          </label>
          <label>
            Пошта:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="modal-create-user-btn">
          Оновити
        </button>
      </form>
    </div>
  );
};
