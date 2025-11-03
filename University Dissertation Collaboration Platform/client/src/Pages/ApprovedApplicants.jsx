import React, { useEffect, useState } from "react";
import DropDown from "../Partials/DropDown";
import CardStudent from "../Components/CardStudent";
import "../Styles/ApprovedApplicants.css";

// Copiem exact aceleași funcții de fetch ca în Dashboard
const fetchProfessorID = async () => {
  const storedEmail = sessionStorage.getItem("userEmail");
  if (!storedEmail) {
    throw new Error("No user email found");
  }

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
      sessionStorage.setItem("userId", data.professorID);
      return data.professorID;
    } else {
      throw new Error(data.message || "Failed to get professor ID");
    }
  } catch (err) {
    console.error("Error fetching professor ID:", err);
    throw err;
  }
};

const fetchTheses = async (profId) => {
  console.log("Sending parameter: ", profId);

  if (!profId) {
    throw new Error("No user email found");
  }

  try {
    const response = await fetch(
      `http://localhost:3001/api/thesis/getThesisByProf/${profId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("Response not ok on fetch thesis");
    }

    const data = await response.json();

    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.message || "Failed to get professor ID");
    }
  } catch (err) {
    console.error("Error fetching professor ID:", err);
    throw err;
  }
};

const fetchFullStudentByThesis = async (thesisId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/students/getFullStudentByThesis/${thesisId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student data");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch student data");
    }

    console.log(
      "THIS IS THE DATA FROM GET STUDENT THESIS" + JSON.stringify(data, null, 2)
    );
    return data.data;
  } catch (err) {
    console.error(`Error fetching student for thesis ${thesisId}:`, err);
    throw err;
  }
};

export default function ApprovedApplicants({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profId = await fetchProfessorID();
        console.log("Professor ID fetched successfully");

        const theses = await fetchTheses(profId);
        console.log("Fetched theses:", theses);

        if (!theses.length) {
          setStudents([]);
          return;
        }

        const studentPromises = theses.map(async (thesis) => {
          try {
            const studentData = await fetchFullStudentByThesis(thesis.id);
            return {
              ...studentData,
              thesis: thesis,
            };
          } catch (error) {
            console.error(
              `Failed to fetch student for thesis ${thesis.id}:`,
              error
            );
            return null;
          }
        });

        const studentResults = await Promise.all(studentPromises);
        const validStudents = studentResults.filter(Boolean);
        setStudents(validStudents);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
    console.log("ACESTEA SUNT DATELE " + students);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  // Filtram studenții cu teze aprobate doar la render
  const approvedStudents = students.filter(
    (student) => student.thesis.stare === "Aprobată"
  );
  approvedStudents.map((student) =>
    console.log("DECI AVEM ID SI NUME " + JSON.stringify(student, null, 2))
  );

  return (
    <>
      <DropDown onLogout={onLogout} />
      <div className="containerApprovedStudents">
        <h1 className="text-2xl font-bold mb-4">Aplicanti acceptati</h1>

        {approvedStudents.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {approvedStudents.map((student, index) => (
              <div>
                <CardStudent
                  key={student.id || index}
                  studentId={student.id}
                  name={student.nume_complet}
                  specializare={student.specializare}
                  serie={student.serie}
                  grupa={student.grupa}
                  thesisId={student.thesis.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>Nu ai acceptat inca studenti.</p>
        )}
      </div>
    </>
  );
}
