import { useEffect, useState } from "react";
// import { locals } from "../../../server/src/app";

const updateThesisStatusNeincarcata = async (thesisId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/thesis/updateThesisStareNeincarcata/${encodeURIComponent(
        thesisId
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update thesis status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating thesis status:", error);
    throw error;
  }
};

const fetchThesisProfessorID = async () => {
  const studentId = sessionStorage.getItem("userId");

  if (studentId) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/getThesisProfessorIdByStudentId/${encodeURIComponent(
          studentId
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch thesis info");
      }

      const data = await response.json();
      console.log("Received thesis:", data);

      if (data.success) {
        return data.theses.id_profesor;
      }
    } catch (err) {
      console.log("Error fetching thesis info:", err);
      // Setăm valorile default în caz de eroare
    }
  }
};

const fetchProfessorNameById = async (professorId) => {
  if (professorId) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/professors/getProfessorNameById/${encodeURIComponent(
          professorId
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profesor info");
      }

      const data = await response.json();
      console.log("Received profesor:", data);

      if (data.success) {
        return data.profesor.nume_complet;
      }
    } catch (err) {
      console.log("Error fetching profesor info:", err);
      // Setăm valorile default în caz de eroare
    }
  }
};

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

const getProf = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/professors/getAllProf",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Api response for debug:", data);
    if (!response.ok) {
      throw new Error(data.message || "Network response is not ok!");
    }

    console.log("Filtered data:", data.data);

    const today = new Date().toISOString().split("T")[0];
    return data.data.filter(
      (prof) =>
        prof.nr_elevi < 10 &&
        today >= prof.perioada_start &&
        today <= prof.perioada_final
    ); // proprietatea data din response tine informatia de la return
  } catch (err) {
    console.log("Error fetching professors!", err);
    throw err;
  }
};

function AlegeProfesor() {
  const [professors, setProfessors] = useState([]); // Array of all professors
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [respins, setIsRespins] = useState(false);

  useEffect(() => {
    const loadProf = async () => {
      try {
        setIsLoading(true);
        const data = await getProf();

        if (data.length === 0) {
          setError(
            "Nu există momentan profesori disponibili pentru coordonare."
          );
          return;
        }

        setProfessors(data);
        setError(null);
      } catch (err) {
        setError(
          "Nu s-au putut încărca profesorii. Vă rugăm încercați mai târziu."
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadProf();
  }, []);

  useEffect(() => {
    const functionToFetch = async () => {
      const result = await fetchThesisStatus();
      const id_profesor_cerut = await fetchThesisProfessorID();
      const nume_complet_cerut = await fetchProfessorNameById(
        id_profesor_cerut
      );
      console.log("SA VEDEM REZULTATUL DIN ALEGE PROFESOR " + result);
      console.log("SA VEDEM SI ID UL DE PROF " + id_profesor_cerut);
      console.log(
        "SA VEDEM SI NUMELEE PE CARE ILL VOIAAM " + nume_complet_cerut
      );

      if (result === "In evaluare") {
        setIsSent(true);
        setSelectedProfesor((prevData) => ({
          ...prevData,
          nume_complet: nume_complet_cerut,
        }));
      } else if (result === "Respinsă") {
        setIsSent(true);
        setSelectedProfesor((prevData) => ({
          ...prevData,
          nume_complet: nume_complet_cerut,
        }));
        setIsRespins(true);
      }
    };
    functionToFetch();
    console.log(
      "THESIS ID DE SESSION STORAGE : " + localStorage.getItem("thesisID")
    );
  }, []);

  async function handleIsSent() {
    setIsSent(true);
    try {
      const thesisId = localStorage.getItem("thesisID");
      const obj = {
        id_prof: selectedProfesor.id,
        stare: "In evaluare",
      };
      const response = await fetch(
        `http://localhost:3001/api/thesis/setThesisProf/${thesisId}`,
        {
          method: "PATCH", // schimbat în PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Network response is not ok!");
      }
    } catch (err) {
      console.log("Error updating professor:", err);
      throw err;
    }
  }

  function handleRespingereColaborare() {
    setIsSent(false);
    setSelectedProfesor(null); // schimbat din ""
    setIsRespins(false);
  }

  async function handleIntoarceLaAles() {
    setIsSent(false);
    setSelectedProfesor(null); // schimbat din ""
    setIsRespins(false);
    await updateThesisStatusNeincarcata(localStorage.getItem("thesisID"));
  }

  if (isLoading) {
    return <div>Se încarcă...</div>;
  }

  if (error) {
    return (
      <div className="formContainer">
        <label
          className="formGroup"
          style={{ textAlign: "center", color: " #d8d7d7" }}
        >
          {error}
        </label>
      </div>
    );
  }

  return (
    <>
      {isSent === false ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedProfesor !== null) handleIsSent();
          }}
          className="profesorContainer"
        >
          <div className="profesorGroup">
            <label htmlFor="profesor">
              Alegeti profesorul coordonator dorit:
            </label>
            <select
              id="profesor"
              value={selectedProfesor ? selectedProfesor.id : ""}
              onChange={(e) => {
                const selected = professors.find(
                  (prof) => prof.id.toString() === e.target.value
                );
                setSelectedProfesor(selected);
              }}
              required
            >
              <option value="">Selecteaza</option>
              {professors.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nume_complet}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="formButton"
            disabled={!selectedProfesor}
          >
            Trimite
          </button>
        </form>
      ) : respins === false ? (
        <>
          <div className="paragrafContainer">
            <span className="pendingIcon">
              <i className="bi bi-clock"></i>
            </span>
            <p id="parafInstiintare">
              {selectedProfesor.nume_complet} a fost instiintat. Se asteapta un
              raspuns.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="acceptareContainer">
            <i className="bi bi-x-circle-fill text-danger"></i>
            <p className="text-danger fw-bold mt-2">Colaborare respinsa</p>
          </div>
          <div className="acceptareContainerV2">
            <p>
              Cadrul didactic {selectedProfesor.nume_complet} nu a putut incepe
              colaborarea cu tine pentru lucrarea de licenta. Va trebui sa
              incerci din nou alaturi de un alt profesor.
            </p>
            <button className="formButton" onClick={handleIntoarceLaAles}>
              Ok! Intoarce-ma la alesul profesorului!
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default AlegeProfesor;
