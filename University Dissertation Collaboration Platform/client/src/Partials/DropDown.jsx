import React from "react";
import "../Styles/DropDown.css";
import { Link, useNavigate } from "react-router-dom";

export default function DropDown({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Apelăm funcția de logout primită ca prop
    navigate("/"); // Navigăm către pagina principală
  };

  return (
    <div className="hamburger-container">
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="hamburger-button">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <nav className="side-menu">
        <ul>
          <li>
            <Link to="/profilProfesor" className="text-left text-dark mb-2">
              Profil
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-left text-dark mb-2">
              Vizualizare cereri
            </Link>
          </li>
          <li>
            <Link
              to="/aplicanti-acceptati"
              className="text-left text-dark mb-2"
            >
              Aplicanti acceptati
            </Link>
          </li>
          <li>
            <Link to="/help-professor" className="text-left text-dark mb-2">
              Ajutor
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-left text-dark mb-2 border-0 bg-transparent w-full hover:bg-gray-100 px-0 py-2 text-decoration-underline"
            >
              Ieși din cont
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
