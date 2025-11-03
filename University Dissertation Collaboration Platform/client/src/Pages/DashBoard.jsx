import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import DropDown from "../Partials/DropDown";
import "../Styles/Dashboard.css";

// Separate API functions
const fetchProfessorID = async () => {
  const storedEmail = sessionStorage.getItem("userEmail");
  console.log("Retrieved email:", storedEmail);

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

    // If we get a 404, it means no theses found - return empty array
    if (response.status === 404) {
      return [];
    }

    // For other non-OK responses, throw error
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
const fetchStudentByThesis = async (thesisId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/students/getStudentByThesis/${thesisId}`,
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

    return data.data;
  } catch (err) {
    console.error(`Error fetching student for thesis ${thesisId}:`, err);
    throw err;
  }
};

const Dashboard = ({ onLogout }) => {
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
            const studentData = await fetchStudentByThesis(thesis.id);
            console.log("Fetched student:", studentData);
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
        console.log("dadada " + JSON.stringify(validStudents, null, 2));
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
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

  return (
    <>
      {" "}
      <DropDown onLogout={onLogout} />
      <div className="container mx-auto p-4 containerDashboard">
        <h1 className="text-2xl font-bold mb-4">Vizualizare cereri studenti</h1>

        {students.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student, index) => (
              <Card
                key={student.id || index}
                studentName={student.nume_complet}
                thesisTitle={student.thesis.titlu_lucrare}
                thesisObj={student.thesis}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Nu exista studenti care sa-ti fi trimis inca o cerere.
          </p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
