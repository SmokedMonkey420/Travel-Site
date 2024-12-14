import React from "react";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Result from "./Components/Pages/Result";
import GetStarted from "./Components/Pages/GetStarted";
import DestinationsPage from "./Components/Pages/Destinations";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/get-started" Component={GetStarted} />
            <Route path="/result" Component={Result} />
            <Route path="/destinations" Component={DestinationsPage} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
