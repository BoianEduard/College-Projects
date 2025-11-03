import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function LoginScreen({ onLoggingIn }) {
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    setLoading(true);
    setError(null);
    const token = response.credential;

    // Decodăm tokenul pentru a obține numele
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userName = decodedToken.name; // numele direct din token

    try {
      const endpoint =
        role === "STUDENT"
          ? "http://localhost:3001/api/auth/student/google" // Use full URL
          : "http://localhost:3001/api/auth/professor/google";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message;
        } catch (e) {
          errorMessage = errorText || `HTTP error! status: ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Store user data securely
      sessionStorage.setItem("userToken", token);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem(
        "userId",
        data.data?.studentId || data.data?.professorId
      );
      sessionStorage.setItem("userEmail", decodedToken.email);
      sessionStorage.setItem("userName", userName);

      console.log("Saved username:", userName);

      onLoggingIn();
      navigate(role === "STUDENT" ? "/profilElev" : "/profilProfesor");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message || "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    console.error("Google login error:", error);
    setError("Could not connect to Google services. Please try again.");
  };

  return (
    <div className="loginContainer">
      <h1 className="text-center text-light mb-4">
        Înscriere susținere disertație
      </h1>

      <div className="text-center">
        <i
          className="bi bi-mortarboard text-light"
          style={{ fontSize: "2rem" }}
        ></i>
      </div>

      <p className="text-center text-light mb-3 loginTitle">
        Autentifică-te cu contul tău instituțional
      </p>

      <div className="text-center mb-4">
        <p className="text-light">Te loghezi ca:</p>
        <div className="roleSwitch">
          <span
            className={`roleOption ${
              role === "STUDENT" ? "activeOption" : "inactiveOption"
            }`}
            onClick={() => {
              setRole("STUDENT");
              setError(null);
            }}
          >
            STUDENT
          </span>
          <span
            className={`roleOption ${
              role === "PROFESOR" ? "activeOption" : "inactiveOption"
            }`}
            onClick={() => {
              setRole("PROFESOR");
              setError(null);
            }}
          >
            PROFESOR
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center mb-3">{error}</div>
      )}

      <div className="d-flex flex-column align-items-center">
        {loading ? (
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap={false} // Disabled to prevent COOP issues
          />
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
