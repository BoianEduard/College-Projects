function StatusComponent({ stepProp }) {
  return (
    <div className="statusContainer">
      <div className={stepProp >= 0 ? "statusActive" : "statusInactive"}>
        Completare profil
      </div>
      <i
        className={`bi bi-arrow-right-circle ${
          stepProp >= 1 ? "arrowActive" : "arrowInactive"
        }`}
      ></i>
      <div className={stepProp >= 1 ? "statusActive" : "statusInactive"}>
        Solicita colaborare
      </div>
      <i
        className={`bi bi-arrow-right-circle ${
          stepProp >= 2 ? "arrowActive" : "arrowInactive"
        }`}
      ></i>
      <div className={stepProp >= 2 ? "statusActive" : "statusInactive"}>
        Trimite cerere
      </div>
      <i
        className={`bi bi-arrow-right-circle ${
          stepProp >= 3 ? "arrowActive" : "arrowInactive"
        }`}
      ></i>
      <div className={stepProp >= 3 ? "statusActive" : "statusInactive"}>
        Raspuns cerere
      </div>
    </div>
  );
}

export default StatusComponent;
