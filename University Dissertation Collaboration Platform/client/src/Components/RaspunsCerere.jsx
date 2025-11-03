import React, { useState } from "react";
import { useEffect } from "react";

import DownloadSemnata from "./DownloadSemnata";

function RaspunsCerere({ onTrimiteDinNou }) {
  const [primita, setIsPrimita] = useState(true);
  const [aprobata, setIsAprobata] = useState(true);

  function handlePrimireCerere() {
    setIsPrimita(true);
    setIsAprobata(true);
  }
  function handleRespingereCerere() {
    setIsPrimita(true);
    setIsAprobata(false);
  }

  return primita === false ? (
    <>
      <div className="raspunsCerere">
        <div className="iconContainer">
          <i className="bi bi-three-dots text-accent"></i>
        </div>
        <p className="raspunsText">
          Cererea ta a fost trimisă. Se așteaptă lucrarea semnată de către
          profesorul coordonator.
        </p>
      </div>
      <button onClick={handlePrimireCerere}>A venit</button>
      <button onClick={handleRespingereCerere}>A fost respinsa</button>
    </>
  ) : aprobata === true ? (
    <>
      <div className="acceptareContainer">
        <i className="bi bi-check-circle-fill text-success"></i>
        <p className="text-success fw-bold mt-2">Succes</p>
      </div>
      <div className="acceptareContainerV2">
        <p>
          Cererea ta a fost semnata de catre profesorul coordonator. O poti
          descarca mai jos.
        </p>
        <p>Spor la lucru!</p>

        <DownloadSemnata
          studentId={sessionStorage.getItem("userId")}
        ></DownloadSemnata>
      </div>
    </>
  ) : (
    <>
      <div className="acceptareContainer">
        <i className="bi bi-x-circle-fill text-danger"></i>
        <p className="text-danger fw-bold mt-2">Respinsa</p>
      </div>
      <div className="acceptareContainerV2">
        <p>
          Cererea ta a fost respinsa de catre profesorul coordonator.Probabil
          ceva din ce ai completat este gresit.
        </p>
        <p>Trimite din nou</p>
        <button className="formButton" onClick={onTrimiteDinNou}>
          Incearca din nou
        </button>
      </div>
    </>
  );
}

export default RaspunsCerere;
