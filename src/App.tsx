import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
    </Router>
  );
};

export default App;
