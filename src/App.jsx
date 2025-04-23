import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useSearchParams } from "react-router-dom";
import ProblemForm from "./components/ProblemForm";
import ProblemList from "./components/ProblemList";
import PredefinedProblems from "./components/PredefinedProblems";
import TechnicienProblemList from "./components/TechnicienProblemList";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Routes only, no nav and no titles */}
        <Routes>
          <Route path="/reportproblem" element={<ReportProblem />} />
          <Route path="/problemlist" element={<ProblemStatus />} />
          <Route path="/predefined" element={<PredefinedProblems />} />
          <Route path="/technicien-problems" element={<TechnicienProblemStatus />} />
          <Route path="/" element={<HomeLinks />} />
        </Routes>
      </div>
    </Router>
  );
};

// Report Problem Component
const ReportProblem = () => {
  const [searchParams] = useSearchParams();
  const chefId = searchParams.get("chefId") || "unknown";

  return <ProblemForm chefId={chefId} />;
};

// Problem Status Component
const ProblemStatus = () => {
  const [searchParams] = useSearchParams();
  const chefId = searchParams.get("chefId") || "unknown";

  return <ProblemList chefId={chefId} />;
};

// Technicien Problem Status Component
const TechnicienProblemStatus = () => {
  const [searchParams] = useSearchParams();
  const technicienId = searchParams.get("technicienId") || "unknown";

  return <TechnicienProblemList technicienId={technicienId} />;
};

// Home Links Component
const HomeLinks = () => {
  return (
    <div className="home-links">
      <h2>Welcome to the Maintenance System</h2>
      <div className="link-buttons">
        <Link to="/reportproblem?chefId=chef123" className="link-button">
          Chef: Report Problem
        </Link>
        <Link to="/problemlist?chefId=chef123" className="link-button">
          Chef: View Problems
        </Link>
        <Link to="/technicien-problems?technicienId=tech123" className="link-button">
          Technician: View Assigned Problems
        </Link>
        <Link to="/predefined" className="link-button">
          View Predefined Problems
        </Link>
      </div>
    </div>
  );
};

export default App;