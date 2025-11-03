import StatusComponent from "./StatusComponent";

function NavBar({ stepProp }) {
  return (
    <div className="navBar">
      <StatusComponent stepProp={stepProp}></StatusComponent>
    </div>
  );
}

export default NavBar;
