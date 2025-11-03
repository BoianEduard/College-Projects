import React, { useState, useEffect, memo } from "react";
import "../Styles/ProfilProfesor.css";
import DropDown from "../Partials/DropDown";

const fetchProfessorID = async () => {
  const storedEmail = sessionStorage.getItem("userEmail");
  console.log("Retrieved email:", storedEmail);

  if (storedEmail) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/professors/getProfessorID/${storedEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch professor ID");
      }

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("userId", data.professorID); // Salvează în sessionStorage
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching professor ID:", err);
    }
  }
};

// API function to get number of students for a professor
const fetchStudentCount = async (professorId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/thesis/getNumberOfStudents/${encodeURIComponent(
        professorId
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch student count");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student count:", error);
    throw error;
  }
};
const updateStudentCount = async () => {
  try {
    const data = await fetchStudentCount(sessionStorage.getItem("userId"));
    // aici poți folosi datele
    console.log("THIS IS THE DATA FROM STUDENT COUNT" + data);
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateStudentCountInDB = async (professorId, studentCount) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/professors/updateNrElevi/${professorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nr_elevi: studentCount }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update student count in DB");
    }

    console.log("Student count updated successfully in DB:", data.message);
  } catch (error) {
    console.error("Error updating student count in DB:", error);
  }
};

function ProfilProfesor({
  numarElevi,
  setNumarElevi,
  intervalStart,
  setIntervalStart,
  intervalEnd,
  setIntervalEnd,
  onLogout,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    console.log("Retrieved username:", storedName); // verificăm ce recuperăm

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("aici merge 1");
        await fetchProfessorID();
        console.log("aici merge 2");

        // Adaugă un delay mic pentru a te asigura că userId e salvat
        await new Promise((resolve) => setTimeout(resolve, 100));

        const userId = sessionStorage.getItem("userId");
        console.log("userId din sessionStorage:", userId); // verifică dacă există userId

        if (userId) {
          try {
            const response = await fetchStudentCount(userId);
            console.log("Data from fetchStudentCount:", response.data);
            if (response.success && response.data.studentCount <= 10) {
              setNumarElevi(response.data.studentCount);
              //Acum trebuie sa facem si update in baza de date

              console.log(
                "INAINTE DE A TRIMIT ID " + response.data.professorId
              );
              await updateStudentCountInDB(
                response.data.professorId,
                response.data.studentCount
              );
              console.log("UPDATED IN DATABSE NR ELEVI");
            }
          } catch (error) {
            console.error("Error in fetchStudentCount:", error);
          }
        } else {
          console.error("Nu s-a găsit userId în sessionStorage");
        }

        console.log("aici merge 3");
      } catch (error) {
        console.error("Error in initializeData:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchIntervals = async () => {
      const professorEMAIL = sessionStorage.getItem("userEmail");
      console.log("Professor EMAIL:", professorEMAIL);

      if (professorEMAIL) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/professors/getIntervalsProf/${encodeURIComponent(
              professorEMAIL
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch intervals");
          }

          const data = await response.json();

          if (data.success && data.intervals) {
            console.log("Received intervals:", data.intervals);
            // Format the dates to YYYY-MM-DD
            const formatDate = (dateString) => {
              if (!dateString) return null;
              // Adăugăm o zi la data primită
              const date = new Date(dateString);
              date.setDate(date.getDate() + 1);
              return date.toISOString().split("T")[0];
            };

            setIntervalStart(formatDate(data.intervals.intervalStart));
            setIntervalEnd(formatDate(data.intervals.intervalEnd));
          } else {
            setIntervalStart(null);
            setIntervalEnd(null);
            console.error("No intervals found or other error:", data.message);
          }
        } catch (err) {
          console.error("Error fetching intervals:", err);
          setIntervalStart(null);
          setIntervalEnd(null);
        }
      }
    };

    fetchIntervals();
  }, [setIntervalStart, setIntervalEnd]);

  async function handleFormSubmit(e) {
    e.preventDefault(); // Previne refresh-ul paginii
    setShowPopup(true); // Afișează pop-up-ul
    setTimeout(() => {
      setShowPopup(false); // Ascunde pop-up-ul după 2 secunde
    }, 2000);

    console.log("Interval start: " + intervalStart);
    console.log("Interval end: " + intervalEnd);

    // Verifică dacă intervalele sunt corecte înainte de a trimite
    const validIntervalStart = intervalStart || null;
    const validIntervalEnd = intervalEnd || null;

    const email = sessionStorage.getItem("userEmail");
    console.log("EMAIL: " + email);

    try {
      const intervalData = {
        intervalStart: validIntervalStart,
        intervalEnd: validIntervalEnd,
      };
      const professorID = sessionStorage.getItem("userId");
      console.log("Profesor id PENTRU INTERVALE: " + professorID);

      const response = await fetch(
        `http://localhost:3001/api/professors/putIntervalsProf/${professorID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(intervalData),
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
      console.error("Error updating professor intervals:", err);
      setError("Failed to update professor intervals. Please try again later.");
    }
  }

  return (
    <>
      <DropDown onLogout={onLogout} />
      <div className="containerProfil">
        <h2>Editare date profesor</h2>
        <div className="profileIconContainer">
          <i className="bi bi-person-circle profileIcon"></i>
        </div>
        <h1>{userName}</h1>
        <form className="formContainer" onSubmit={handleFormSubmit}>
          <div className="formGroup">
            <label id="labelProfesor">
              Numar elevi pentru licenta: {numarElevi} (maxim 10)
            </label>
          </div>
          <div className="formGroup">
            <label style={{ fontWeight: "300" }} id="labelProfesor">
              Interval in care studentii pot depune cereri catre dumneavoastra:
            </label>
            <label htmlFor="intervalStart">Data început:</label>
            <input
              type="date"
              id="intervalStart"
              value={intervalStart || ""}
              onChange={(e) => setIntervalStart(e.target.value)}
              required
            />
            <label htmlFor="intervalEnd" style={{ marginTop: "15px" }}>
              Data sfârșit:
            </label>
            <input
              type="date"
              id="intervalEnd"
              value={intervalEnd || ""}
              onChange={(e) => setIntervalEnd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="formButton">
            Salveaza Date
          </button>
        </form>
      </div>
      {showPopup && (
        <div className="popupMessage">
          <p>Datele au fost salvate cu succes!</p>
          <i className="bi bi-check-circle-fill text-success"></i>
        </div>
      )}
    </>
  );
}

export default ProfilProfesor;
