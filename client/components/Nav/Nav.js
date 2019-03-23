// import react for creating our components
import React from "react";
// import NavLinks for our routes inside the list items
import { NavLink } from "react-router-dom";

// stateless navigation component
const Nav = () => (
  <nav
    className="d-flex flex-column justify-content-center"
    style={{ height: "50px" }}
  >
    <ul className="nav justify-content-center">
      <li className="nav-item mx-2">
        <NavLink
          exact
          to="/"
          activeStyle={{ fontWeight: "bold", color: "#000" }}
        >
          Search
        </NavLink>
      </li>{" "}
      |
      <li className="nav-item mx-2">
        <NavLink
          exact
          to="/index"
          activeStyle={{ fontWeight: "bold", color: "#000" }}
        >
          Index
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Nav;
