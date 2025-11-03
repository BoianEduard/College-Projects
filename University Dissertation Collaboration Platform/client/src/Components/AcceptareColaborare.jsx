import React, { useState, useEffect } from "react";

function AcceptaColaborare({ setStep }) {
  const [thesisStatus, setThesisStatus] = useState("Neîncărcată");
  const [fileUrl, setFileUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
      }
    }
  };

  useEffect(() => {
    const functie = async () => {
      console.log("am ajuns in componenta asta");
      const studentId = sessionStorage.getItem("userId");
      if (studentId) {
        const result = await fetchThesisStatus(studentId);
        console.log("result este " + JSON.stringify(result, null, 2));

        if (result === "Semnata") {
          setStep(3);
        }
      } else {
        setErrorMessage("ID-ul studentului nu a fost găsit");
      }
    };
    functie();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e?.preventDefault(); // Pentru cazul când e folosit în form

    if (!selectedFile) {
      setErrorMessage("Te rugăm să selectezi un fișier");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const studentId = sessionStorage.getItem("userId");
    console.log("IDUL STUDENTIULUI ESSSTEEEE ", studentId);

    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/uploadThesis/${encodeURI(studentId)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchThesisStatus(studentId);
        setThesisStatus("In evaluare");
      } else {
        throw new Error(data.message || "Eroare la încărcarea lucrării");
      }
    } catch (error) {
      setErrorMessage(error.message || "Eroare la comunicarea cu serverul");
    } finally {
      setIsUploading(false);
    }
  };

  const renderUploadSection = () => (
    <form onSubmit={handleUpload} className="mt-3">
      <div className="mb-3">
        <input
          type="file"
          id="fileInput"
          className="form-control visually-hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx"
          required
        />
        <label htmlFor="fileInput" className="custom-file-upload">
          <span className="custom-file-button">Choose File</span>
          {selectedFile && (
            <span className="custom-file-label">{selectedFile.name}</span>
          )}
        </label>
      </div>
      <button
        type="submit"
        className="formButton"
        disabled={isUploading || !selectedFile}
      >
        {isUploading ? "Se încarcă..." : "Trimite Fișier"}
      </button>
    </form>
  );

  if (thesisStatus === "Neîncărcată") {
    return (
      <>
        <div className="raspunsCerere">
          <div className="iconContainer">
            <i className="bi bi-three-dots text-accent"></i>
          </div>
          <p className="raspunsText">
            Nu ai încărcat încă lucrarea. Te rugăm să încarci lucrarea semnată
            de către profesorul coordonator.
          </p>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          {renderUploadSection()}
        </div>
      </>
    );
  }

  if (thesisStatus === "In evaluare") {
    return (
      <>
        <div className="raspunsCerere">
          <div className="iconContainer">
            <i className="bi bi-three-dots text-accent"></i>
          </div>
          <p className="raspunsText">
            Lucrarea ta a fost trimisă și este în curs de evaluare de către
            profesorul coordonator.
          </p>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        </div>
      </>
    );
  }

  if (thesisStatus === "Aprobată") {
    return (
      <>
        <div className="acceptareContainer">
          <i className="bi bi-check-circle-fill text-success"></i>
          <p className="text-success fw-bold mt-2">Aprobată</p>
        </div>
        <div className="acceptareContainerV2">
          <p>
            Lucrarea ta a fost aprobată de către profesorul coordonator.
            {fileUrl && " O poți descărca mai jos."}
          </p>
          <p>Spor la lucru!</p>
          {fileUrl && (
            <a
              href={fileUrl}
              download="Lucrare_Licenta.pdf"
              className="formButton mt-3"
            >
              Descarcă Documentul
            </a>
          )}
        </div>
      </>
    );
  }

  if (thesisStatus === "Respinsă") {
    return (
      <>
        <div className="acceptareContainer">
          <i className="bi bi-x-circle-fill text-danger"></i>
          <p className="text-danger fw-bold mt-2">Respinsă</p>
        </div>
        <div className="acceptareContainerV2">
          <p>
            Lucrarea ta a fost respinsă de către profesorul coordonator.
            Probabil sunt necesare modificări sau completări.
          </p>
          <p>
            Te rugăm să încerci din nou după efectuarea modificărilor necesare.
          </p>
          {renderUploadSection()}
        </div>
      </>
    );
  }

  return null;
}

export default AcceptaColaborare;
