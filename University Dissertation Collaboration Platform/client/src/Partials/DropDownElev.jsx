import { Link } from "react-router-dom";
import React from "react";
import "../Styles/DropDownElev.css";
import { useNavigate } from "react-router-dom";

function DropDownElev({ onLogout }) {
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
            <Link to="/profilElev" className="text-left text-dark mb-2">
              Profil
            </Link>
          </li>
          <li>
            <Link to="/" className="text-left text-dark mb-2">
              Cerere
            </Link>
          </li>
          <li>
            <Link to="/help-student" className="text-left text-dark mb-2">
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

export default DropDownElev;
