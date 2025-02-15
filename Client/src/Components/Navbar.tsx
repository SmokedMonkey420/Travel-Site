import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            TouristSpotter <i className="fa-solid fa-plane" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                to="/destinations"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Destinations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/members"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Members
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/gallery"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Gallery
              </Link>
            </li>
          </ul>
          {button && (
            <Button buttonStyle="btn--outline" to="/gallery">
              Gallery
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
