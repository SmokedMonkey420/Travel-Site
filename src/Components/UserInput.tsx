import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./UserInput.css";

function UserInput() {
  return (
    <div className="user-input-container">
      <h1>Where To?</h1>
      <p>Let us know where you want to go, and we’ll recommend alternatives</p>
      <div className="user-input-wrapper"></div>
    </div>
  );
}

export default UserInput;
