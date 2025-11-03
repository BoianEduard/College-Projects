import React from "react";
import "../Styles/ProfilStudent.css";
import DropDownElev from "../Partials/DropDownElev";
import { useState, useEffect } from "react";

function ProfilStudent({
  onSubmit,
  specializare,
  setSpecializare,
  grupa,
  setGrupa,
  serie,
  setSerie,
  onLogout,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    specializare: "",
    titluLucrare: "",
    serie: "",
    grupa: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Special handling for serie field - convert to uppercase and limit to letters
    if (id === "serie") {
      const upperValue = value.toUpperCase();
      if (/^[A-Z]?$/.test(upperValue)) {
        // Only allow single letters
        setFormData((prev) => ({ ...prev, serie: upperValue }));
      }
      return;
    }

    // Special handling for grupa field - only allow numbers
    if (id === "grupa") {
      if (/^\d*$/.test(value)) {
        // Only allow digits
        setFormData((prev) => ({ ...prev, grupa: value }));
      }
      return;
    }

    // Handle other fields normally
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    // const titluDinSession = sessionStorage.getItem("titluThesis");
    // console.log("titlu din sesion " + titluDinSession);
    const storedName = sessionStorage.getItem("userName");
    console.log("Retrieved username:", storedName); // verificăm ce recuperăm

    // if (titluDinSession) {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     titluLucrare: titluDinSession,
    //   }));
    // }

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const studentId = sessionStorage.getItem("userId");

      if (studentId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/students/getStudentInfo/${encodeURIComponent(
              studentId
            )}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch student info");
          }

          const data = await response.json();

          if (data.success) {
            console.log("Received student info:", data.studentInfo);

            // Setăm valorile default pentru câmpurile null
            setFormData((prevData) => ({
              ...prevData,
              specializare: data.studentInfo?.specializare || "",
              serie: data.studentInfo?.serie || "",
              grupa: data.studentInfo?.grupa || "",
            }));
          }
        } catch (err) {
          console.error("Error fetching student info:", err);
          // Setăm valorile default în caz de eroare
          setFormData({
            specializare: "",
            titluLucrare: "Nu a fost setat încă",
            serie: "",
            grupa: "",
          });
        }
      }
    };

    const fetchThesisName = async () => {
      const studentId = sessionStorage.getItem("userId");

      if (studentId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/thesis/getThesisTitleByStudent/${encodeURIComponent(
              studentId
            )}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch thesis info");
          }

          const data = await response.json();
          console.log("Received thesis:", data);

          // Setăm un string gol sau mesaj default pentru conturile noi
          setFormData((prevData) => ({
            ...prevData,
            titluLucrare: data.theses?.titlu_lucrare || "",
          }));
        } catch (err) {
          console.log("Error fetching thesis info:", err);
          // Setăm valorile default în caz de eroare
          setFormData((prev) => ({
            ...prev,
            titluLucrare: "",
          }));
        }
      }
    };
    fetchStudentInfo();
    fetchThesisName();
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit(e);

    try {
      const studentId = sessionStorage.getItem("userId");
      const studentInfo = {
        major: formData.specializare,
        series: formData.serie,
        cls: formData.grupa,
      };
      const response = await fetch(
        `http://localhost:3001/api/students/updateProfile/${encodeURIComponent(
          studentId
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(studentInfo),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      } else {
        console.error("Error response", data);
      }
    } catch (err) {
      console.error("Error updating student info:", err);
    }
  }
  return (
    <>
      <DropDownElev onLogout={onLogout} />
      <div className="containerProfil">
        <h2>Editare date personale</h2>
        <div className="profileIconContainer">
          <i className="bi bi-person-circle profileIcon"></i>
        </div>
        <h1>{userName}</h1>

        <form onSubmit={handleFormSubmit} className="formContainer">
          <div className="formGroup">
            <label htmlFor="specializare">Specializare:</label>
            <select
              id="specializare"
              value={formData.specializare}
              onChange={handleChange}
              required
            >
              <option value="">Selectează</option>
              <option value="Informatica Economica">
                Informatica Economica
              </option>
              <option value="Cibernetica">Cibernetica</option>
              <option value="Statistica">Statistica</option>
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="serie">Serie:</label>
            <input
              id="serie"
              type="text"
              value={formData.serie}
              onChange={handleChange}
              maxLength="1"
              pattern="[A-Za-z]"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="grupa">Grupa:</label>
            <input
              id="grupa"
              type="text"
              value={formData.grupa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label id="labelProfesor">Titlu lucrare de licenta:</label>
            <label id="labelProfesor">
              {formData.titluLucrare
                ? formData.titluLucrare
                : "Lucrarea n-a fost aleasa inca"}
            </label>
          </div>

          <button type="submit" className="formButton">
            Salveaza Date
          </button>
        </form>
      </div>
      {/* Pop-up-ul */}
      {showPopup && (
        <div className="popupMessage">
          <p>Datele au fost salvate cu succes!</p>
          <i className="bi bi-check-circle-fill text-success"></i>
        </div>
      )}
    </>
  );
}
export default ProfilStudent;
