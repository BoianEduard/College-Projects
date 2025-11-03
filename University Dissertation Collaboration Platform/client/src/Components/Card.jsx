import React, { useState, useEffect } from "react";
import "../Styles/Card.css";

const updateThesisStatusAccepted = async (thesisId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/thesis/updateThesisStare/${encodeURIComponent(
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

const updateThesisStatusRejected = async (thesisId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/thesis/updateThesisStareRefuzata/${encodeURIComponent(
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

//aici trebuiet sa preluam din bd pentru fiecare id corespunzator lista cu cei care vor sa aplice , care au statusul de pending
export default function Card({ studentName, thesisTitle, thesisObj }) {
  const [showOrNot, setShowOrNot] = useState(
    thesisObj.stare !== "Aprobată" && thesisObj.stare !== "Respinsă"
  );
  function handleAcceptareCerere() {
    console.log("MERGE FRATE");
    console.log(thesisObj);
    const asyncFunctionToRun = async () => {
      await updateThesisStatusAccepted(thesisObj.id);
    };
    asyncFunctionToRun();
    setShowOrNot(false);
  }
  function handleRefuzareCerere() {
    console.log("MERGE FRATE");
    console.log(thesisObj);
    const asyncFunctionToRun = async () => {
      await updateThesisStatusRejected(thesisObj.id);
    };
    asyncFunctionToRun();
    setShowOrNot(false);
  }

  return showOrNot ? (
    <div className="card">
      <div className="card-body">
        <h5 className="card-name">{studentName}</h5>
        <p className="card-text" id="cardProfesor">
          Doreste sa faca parte din echipa dvs. de Disertatie
        </p>
        <p className="card-thesis-title" id="cardProfesor">
          Titlu lucrare de licenta: {thesisTitle}
        </p>
      </div>
      <div className="buttons">
        <button
          className="confirm"
          onClick={handleAcceptareCerere}
          onChange={(e) => e.preventDefault()}
        >
          Accepta
        </button>
        <button
          className="reject"
          onClick={handleRefuzareCerere}
          onChange={(e) => e.preventDefault()}
        >
          Refuza
        </button>
      </div>
    </div>
  ) : (
    false
  );
}
