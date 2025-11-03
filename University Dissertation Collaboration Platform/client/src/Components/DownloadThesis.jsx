import { useState } from "react";

const DownloadThesis = ({ studentId, thesisId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const updateThesisStatusSigned = async (thesisId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/updateThesisStareSemnata/${encodeURIComponent(
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

  const handleDownload = async () => {
    setIsDownloading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/thesis/downloadThesis/${encodeURI(
          studentId
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "thesis.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(error.message || "Eroare la descărcarea lucrării");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("STUDENT ID STUDENT ID STUDENT ID " + studentId);
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

      event.target.value = ""; // Reset file input
      setSelectedFile(null);
      console.log("THESIS ID CARE AR TRB SA FIE BUN " + thesisId);
      const asyncFunctionToRun = async () => {
        await updateThesisStatusSigned(thesisId);
      };
      asyncFunctionToRun();
    } catch (error) {
      setErrorMessage(error.message || "Eroare la încărcarea lucrării");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#2c2c2c", marginTop: "10px", padding: "20px" }}
    >
      <button
        onClick={handleDownload}
        className="formButton"
        disabled={isDownloading}
      >
        {isDownloading
          ? "Se descarcă..."
          : "Descarcă cererea primita de la student"}
      </button>

      <div
        style={{
          marginTop: "15px",
          backgroundColor: "#2c2c2c",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
        />
        <label
          htmlFor="fileInput"
          className="formButton"
          style={{
            cursor: "pointer",
            opacity: isUploading ? 0.7 : 1,
          }}
        >
          {isUploading ? "Se trimite..." : "Trimite sererea semnata"}
        </label>
      </div>

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </div>
  );
};

export default DownloadThesis;
