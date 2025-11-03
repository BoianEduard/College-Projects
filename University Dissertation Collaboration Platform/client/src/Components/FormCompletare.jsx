import React, { useState, memo, useEffect } from "react";

const fetchThesisStatus = async () => {
  const studentId = sessionStorage.getItem("userId");

  if (studentId) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/getThesisStatusByStudentId/${encodeURIComponent(
          studentId
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thesis info");
      }

      const data = await response.json();
      console.log("Received thesis:", data);

      if (data.success) {
        return data.theses.stare;
      }
    } catch (err) {
      console.log("Error fetching thesis info:", err);
      // Setăm valorile default în caz de eroare
    }
  }
};

function FormCompletare({
  onSubmit,
  specializare,
  setSpecializare,
  titluLucrare,
  setTitluLucrare,
  serie,
  setSerie,
  grupa,
  setGrupa,
  setStep,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    specializare: "",
    titluLucrare: "",
    serie: "",
    grupa: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "serie" ? value.toUpperCase() : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onSubmit(formData);
    console.log("Form data at submit:", formData);

    const studentId = sessionStorage.getItem("userId");
    console.log("Student ID:", studentId);

    // Step 1: Add Thesis
    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/insertThesis/${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ titlu_lucrare: formData.titluLucrare }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        console.error("Error response:", data.message);
        return;
      }

      const thesisId = data?.data?.thesisId;
      if (thesisId) {
        sessionStorage.setItem("thesisId", thesisId);
        localStorage.setItem("thesisID", thesisId);
        sessionStorage.setItem("titluThesis", formData.titluLucrare);
      }
    } catch (err) {
      console.error("Error adding thesis:", err);
      setError("Failed to add thesis. Please try again later.");
      return;
    }

    // Step 3: Update Student Info
    try {
      const thesisId = sessionStorage.getItem("thesisId");
      const studentInfo = {
        major: formData.specializare,
        series: formData.serie,
        cls: formData.grupa,
        lucrare: thesisId,
      };

      const response = await fetch(
        `http://localhost:3001/api/students/updateInfo/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
        setError(data.message || "Something went wrong");
        console.error("Error response:", data);
      }
    } catch (err) {
      console.error("Error updating student info:", err);
      setError("Failed to update student info. Please try again later.");
    }

    setStep((s) => s + 1);
  };

  useEffect(() => {
    const functionToFetch = async () => {
      const result = await fetchThesisStatus();
      console.log("SA VEDEM REZULTATUL " + result);

      if (result) {
        if (result === "Neîncărcată") {
          setStep(0);
        } else if (result === "In evaluare") {
          setStep(1);
          sessionStorage.setItem("step2", true);
        } else if (result === "Aprobată") {
          setStep(2);
        } else if (result === "Respinsă") {
          setStep(1);
        } else if (result === "Semnata") {
          setStep(3);
        }
      }
    };
    functionToFetch();
  }, []);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const studentId = sessionStorage.getItem("userId"); // Presupun că ai ID-ul studentului în sessionStorage
      console.log("Student ID:", studentId);

      if (studentId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/students/getStudentInfo/${encodeURIComponent(
              studentId
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch student info");
          }

          const data = await response.json();

          if (data.success && data.studentInfo) {
            console.log("Received student info:", data.studentInfo);

            setFormData((prevData) => ({
              ...prevData,
              specializare: data.studentInfo.specializare || "",
              serie: data.studentInfo.serie || "",
              grupa: data.studentInfo.grupa || "",
            }));
          } else {
            setFormData((prevData) => ({
              ...prevData,
              specializare: "",
              serie: "",
              grupa: "",
            }));
            console.error(
              "No student info found or other error:",
              data.message
            );
          }
        } catch (err) {
          console.error("Error fetching student info:", err);
          setFormData({
            specializare: "",
            titluLucrare: "",
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
  }, []); // Dependență goală pentru că vrem să ruleze doar la montarea componentei
  return (
    <>
      <form onSubmit={handleFormSubmit} className="formContainer">
        <div className="formGroup">
          <label htmlFor="specializare">Specializare:</label>
          <select
            id="specializare"
            name="specializare"
            value={formData.specializare}
            onChange={handleChange}
            required
          >
            <option value="">Selectează</option>
            <option value="Informatica Economica">Informatica Economica</option>
            <option value="Cibernetica">Cibernetica</option>
            <option value="Statistica">Statistica</option>
          </select>
        </div>

        <div className="formGroup">
          <label htmlFor="grupa">Titlu lucrare licenta:</label>
          <input
            id="grupa"
            name="titluLucrare"
            type="text"
            value={formData.titluLucrare}
            onChange={handleChange}
            placeholder="Ex: Computer cuantic"
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="serie">Serie:</label>
          <input
            id="serie"
            name="serie"
            type="text"
            value={formData.serie}
            onChange={handleChange}
            maxLength="1"
            pattern="[A-Za-z]"
            placeholder="Ex: A"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="grupa">Grupa:</label>
          <input
            id="grupa"
            name="grupa"
            type="number"
            value={formData.grupa}
            onChange={handleChange}
            placeholder="Ex: 101"
            required
          />
        </div>

        <button type="submit" className="formButton">
          Trimite
        </button>
      </form>
      {error && (
        <div className="alert alert-danger text-center mb-3">{error}</div>
      )}
      {showPopup && (
        <div className="popupMessage">
          <p>Datele au fost salvate cu succes!</p>
          <i className="bi bi-check-circle-fill text-success"></i>
        </div>
      )}
    </>
  );
}

export default memo(FormCompletare);
