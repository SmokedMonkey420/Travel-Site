import React from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Pages/Home";
import Result from "./Components/Pages/Result";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import GetStarted from "./Components/Pages/GetStarted";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/get-started" Component={GetStarted} />
        <Route path="/result" Component={Result} />
      </Routes>
    </Router>
  );
};

export default App;
