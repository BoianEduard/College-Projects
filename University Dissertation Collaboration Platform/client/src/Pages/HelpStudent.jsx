import React from "react";
import "../Styles/HelpStudent.css";
import DropDownElev from "../Partials/DropDownElev";

export default function HelpStudent({ onLogout }) {
  return (
    <div>
      <h1>Help</h1>
      <DropDownElev onLogout={onLogout} />
      <div>
        <h1 className="title-flux">Inițializare</h1>
        <h1 className="title">1. Accesarea contului</h1>
        <p className="text">
          Autentificarea în cadrul acestei platformei de asociere pentru licență
          se realizează prin intermediul contului tău instituțional oferit de
          către A.S.E. Platforma este destinată atât studenților care doresc să
          se înscrie sesiunea de licență a anului universitar curent, cât și
          profesorilor coordonatori.
        </p>
        <h1 className="title">2. Completarea datelor personale</h1>
        <p className="text">
          Completează-ți datele personale în pagina de profil, din meniul din
          stanga, dând click pe iconița de meniu. Este necesară completarea atât
          a specializării pentru a putea vizualiza profesorii disponibili, cât
          și a restului datelor personale pentru identificare.
        </p>
      </div>
      <div>
        <h1 className="title-flux">
          Fluxul aplicației - I. Solicitare colaborare.
        </h1>
        <h1 className="title">Alegerea profesorului</h1>
        <p className="text">
          Vei regăsi un tabel cu toți profesorii din cadrul specializării tale.
          După ce te-ai hotărât, apasă pe butonul Solicită, completează în
          fereastra afișată titlul dorit pentru lucrare. După trimiterea
          solicitării, tot ce rămâne este să aștepți răspunsul. Succes!
        </p>
      </div>
      <div>
        <h1 className="title-flux">
          Fluxul aplicației - II. Solicitare acceptată.
        </h1>
        <h1 className="title">1. Generează cererea</h1>
        <p className="text">
          Aici poți să îți generezi cererea de licență, precompletată cu datele
          date din pagina de profil, cu numele profesorului care ți-a acceptat
          solicitarea de colaborare, dar și cu titlul pe care îl introduci
          imediat înainte.
        </p>
        <h1 className="title">2. Încarcă cererea</h1>
        <p className="text">
          În cadrul acestei secțiuni, este necesar să reintroduci titlul
          licenței, în cazul în care nu este precompletat cu cel utilizat pentru
          generarea cererii, ca mai apoi să încarci documentul PDF semnat de
          tine. Odată încarcată, tot ce rămâne este să aștepți ca profesorul tău
          să o semneze.
        </p>
        <h1 className="title">3. Cererea ta semnată</h1>
        <p className="text">
          Ultima secțiune conține cererea ta semnată de către profesorul
          coordonator, în cazul în care a fost aprobată. Este posibil să fie
          respinsă, asa că trebuie să verifici și pe e-mail dacă ai fost
          informat de acest lucru. Acest proces este valabil și în cazul în care
          trimiți o cerere pentru modificarea tematicii de disertatie, după ce
          ți-a fost aprobată una în prealabil.
        </p>
      </div>
    </div>
  );
}
