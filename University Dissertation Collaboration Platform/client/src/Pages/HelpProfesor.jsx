import React from "react";
import "../Partials/DropDown.jsx";
import DropDown from "../Partials/DropDown.jsx";

export default function HelpProfesor({ onLogout }) {
  return (
    <div>
      <h1>Help</h1>
      <DropDown onLogout={onLogout} />
      <div>
        <h1 className="title-flux">Inițializare</h1>
        <h1 className="title">1. Accesarea contului</h1>
        <p className="text">
          Autentificarea în cadrul acestei platformei de asociere pentru
          disertatie se realizează prin intermediul contului instituțional
          oferit de către A.S.E. Platforma este destinată atât studenților care
          doresc să se înscrie sesiunea de licență a anului universitar curent,
          cât și profesorilor coordonatori.
        </p>
        <h1 className="title">
          2. Completarea duratei pentru acceptare cereri lucrare de disertatie{" "}
        </h1>
        <p className="text">
          Completati-va intervalul de acceptare a cererilor pentru lucrarea de
          disertatie în pagina de profil, din meniul din stanga, dând click pe
          iconița de meniu.
        </p>
      </div>
      <div>
        <h1 className="title-flux">
          Fluxul aplicației - I. Vizualizarea studentilor aplicanti.
        </h1>
        <h1 className="title">Alegerea studentilor</h1>
        <p className="text">
          Veti regăsi un dashboard cu toți studentii care au aplicat pentru a
          colabora la disertatie, apasand butonul "Accepta" acesta va fi inrolat
          in echipa dumneavoastra, iar apasand "Refuza" acesta nu va face parte
          din echipa.
        </p>
      </div>
      <div>
        <h1 className="title-flux">
          Fluxul aplicației - II. Solicitare acceptată.
        </h1>
        <h1 className="title">Vizualizarea studentilor</h1>
        <p className="text">
          Facand click pe meniul din stanga si selectand rubrica "Aplicanti
          acceptati" puteti vizualiza toti studentii pe care i-ati acceptat, nu
          uitati ca numarul maxim admis de studenti pentru lucrarea de
          disertatie este de 10.
        </p>
      </div>
    </div>
  );
}
