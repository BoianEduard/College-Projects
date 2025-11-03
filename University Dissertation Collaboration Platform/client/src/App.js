import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./Pages/DashBoard";
import ApprovedApplicants from "./Pages/ApprovedApplicants";
import NavBar from "./Components/NavBar";
import FormCompletare from "./Components/FormCompletare";
import AlegeProfesor from "./Components/AlegeProfesor";
import AcceptareColaborare from "./Components/AcceptareColaborare";
import RaspunsCerere from "./Components/RaspunsCerere";
import LoginScreen from "./Components/LoginScreen";
import ProfilStudent from "./Pages/ProfilStudent";
import HelpStudent from "./Pages/HelpStudent";
import ProfilProfesor from "./Pages/ProfilProfesor";
import HelpProfesor from "./Pages/HelpProfesor";

// Styles
import "./App.css";
import "./Styles/FormCompletareCSS.css";
import "./Styles/Status.css";
import "./Styles/AlegeProfesor.css";
import "./Styles/AcceptareColaborare.css";
import "./Styles/RaspunsCerere.css";
import "./Styles/LoginScreen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DropDownElev from "./Partials/DropDownElev";

function App() {
  const [step, setStep] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [specializare, setSpecializare] = useState("");
  const [serie, setSerie] = useState("");
  const [grupa, setGrupa] = useState("");
  const [titluLucrare, setTitluLucrare] = useState("");
  const [numarElevi, setNumarElevi] = useState(0);
  const [intervalStart, setIntervalStart] = useState(null);
  const [intervalEnd, setIntervalEnd] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      setLoggedIn(true);
    }
    console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
  }, []);

  const handleNext = () => step < 3 && setStep((s) => s + 1);
  const handlePrev = () => step > 0 && setStep((s) => s - 1);
  const handleTrimiteDinNou = () => setStep(2);

  const handleLoggingIn = () => {
    console.log("Login successful");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Ștergem toate datele din sessionStorage
    sessionStorage.clear();
    // sau specific:
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userId");
    setLoggedIn(false);
    setStep(0);
  };

  const handleSubmit = (formData) => {
    console.log("Specializare:", formData.specializare);
    console.log("Serie:", formData.serie);
    console.log("Grupa:", formData.grupa);
    setSpecializare(formData.specializare);
    setTitluLucrare(formData.titluLucrare);
    setSerie(formData.setSerie);
    setGrupa(formData.setGrupa);
  };

  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <LoginScreen onLoggingIn={handleLoggingIn} />;
  };

  const StepContent = () => (
    <>
      <DropDownElev onLogout={handleLogout}></DropDownElev>
      <NavBar stepProp={step} />
      {step === 0 && (
        <FormCompletare
          onSubmit={handleSubmit}
          specializare={specializare}
          setSpecializare={setSpecializare}
          titluLucrare={titluLucrare}
          setTitluLucrare={setTitluLucrare}
          serie={serie}
          setSerie={setSerie}
          grupa={grupa}
          setGrupa={setGrupa}
          setStep={setStep}
        />
      )}
      {step === 1 && <AlegeProfesor />}
      {step === 2 && <AcceptareColaborare setStep={setStep} />}
      {step === 3 && <RaspunsCerere onTrimiteDinNou={handleTrimiteDinNou} />}
    </>
  );

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StepContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aplicanti-acceptati"
            element={
              <ProtectedRoute>
                <ApprovedApplicants onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profilElev"
            element={
              <ProfilStudent
                onSubmit={handleSubmit}
                specializare={specializare}
                setSpecializare={setSpecializare}
                serie={serie}
                setSerie={setSerie}
                grupa={grupa}
                setGrupa={setGrupa}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/profilProfesor"
            element={
              <ProfilProfesor
                numarElevi={numarElevi}
                setNumarElevi={setNumarElevi}
                intervalStart={intervalStart}
                setIntervalStart={setIntervalStart}
                intervalEnd={intervalEnd}
                setIntervalEnd={setIntervalEnd}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/help-student"
            element={<HelpStudent onLogout={handleLogout} />}
          />
          <Route
            path="/help-professor"
            element={<HelpProfesor onLogout={handleLogout} />}
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
