import React from "react";
import Sidebar from "./Components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Components/Pages/Home";
import Result from "./Components/Pages/Result";
import GetStarted from "./Components/Pages/GetStarted"; // Corrected import for GetStarted
import DestinationsPage from "./Components/Pages/Destinations";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/" element={<Navigate replace to="/get-started" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/destinations" element={<DestinationsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
