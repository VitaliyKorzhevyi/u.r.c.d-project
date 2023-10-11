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

  const onEditUser = () => {
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
      last_name: "Прізвище",
      middle_name: "По батькові",
      birthday: "Дата народження",
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

        toast.success(`Дані пацієнта успішно оновлено`, {
          autoClose: 1000,
        });
        setTimeout(() => {
          setFirstName("");
          setLastName("");
          setMiddleName("");
          setBirthday("");
          setPhone("");
          setEmail("");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onEditUser();
      }}
      className="form-patient-container"
    >
      <div className="form-patient-semi-container">
        <div className="form-patient-editing form1">
          <div>
            <label htmlFor="last_name">Прізвище:&nbsp;</label>
            <input
              id="last_name"
              type="text"
              autoComplete="off"
              value={last_name}
              onChange={(e) => setLastName(capitalize(e.target.value))}
              className="form-patient-editing-input"
            />
          </div>
          <div>
            <label htmlFor="birthday">Дата народження:&nbsp;</label>
            <input
              id="birthday"
              type="date"
              autoComplete="off"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="form-patient-editing-birthday"
            />
          </div>
        </div>
        <div className="form-patient-editing form2">
          <div>
            <label htmlFor="first_name">Ім'я:&nbsp;</label>
            <input
              id="first_name"
              type="text"
              autoComplete="off"
              value={first_name}
              onChange={(e) => setFirstName(capitalize(e.target.value))}
              className="form-patient-editing-input"
            />
          </div>
          <div>
            <label htmlFor="phone">Телефон:&nbsp;</label>
            <input
              id="phone"
              type="phone"
              autoComplete="off"
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
              className="form-patient-editing-input"
            />
          </div>
        </div>

        <div className="form-patient-editing form3">
          <div>
            <label htmlFor="middle_name">По батькові:&nbsp;</label>
            <input
              id="middle_name"
              type="text"
              autoComplete="off"
              value={middle_name}
              onChange={(e) => setMiddleName(capitalize(e.target.value))}
              // className="form-patient-editing-input"
            />
          </div>
          <div>
            <label htmlFor="email">Пошта:&nbsp;</label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-patient-editing-input"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="form-patient-editing-btn">
        Редагувати
      </button>
    </form>
  );
};
