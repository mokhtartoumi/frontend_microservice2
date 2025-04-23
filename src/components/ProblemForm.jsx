import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProblemForm.css";

// Mock problem icons - replace with your actual images
const problemIcons = {
  safety: "🔒",
  equipment: "🔧",
  payment: "💳",
  facility: "🏢",
  other: "❓",
  pomp: "🚒", // Example for pomp problem
  leak: "💧",
  electrical: "⚡",
  cleanliness: "🧹"
  
};

const ProblemForm = ({ chefId, fetchProblems }) => {
  const [predefinedProblems, setPredefinedProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [customDescription, setCustomDescription] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPredefinedProblems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/problems/predefined");
        setPredefinedProblems(response.data);
      } catch (error) {
        console.error("Error fetching predefined problems:", error);
        alert("Failed to load predefined problems");
      }
    };
    fetchPredefinedProblems();
  }, []);

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setShowCustomForm(false);
    setCustomDescription("");
  };

  const handleCustomProblemClick = () => {
    setSelectedProblem(null);
    setShowCustomForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let problemData;
      
      if (showCustomForm) {
        problemData = {
          chefId,
          description: customDescription,
          type: "other",
          isPredefined: false
        };
      } else {
        problemData = {
          chefId,
          description: selectedProblem.description,
          type: selectedProblem.type,
          isPredefined: false
        };
      }

      await axios.post("http://localhost:3001/problems", problemData);
      alert("Problem reported successfully!");
      resetForm();
      if (fetchProblems) fetchProblems();
    } catch (error) {
      console.error("Error reporting problem:", error);
      alert(error.response?.data?.error || "Failed to report problem");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProblem(null);
    setCustomDescription("");
    setShowCustomForm(false);
  };

  return (
    <div className="problem-form-container">
      <h2>Report a Problem</h2>
      
      {!selectedProblem && !showCustomForm ? (
        <div className="problem-selection">
          <h3>Select a problem type:</h3>
          <div className="predefined-problems">
            {predefinedProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="problem-card"
                onClick={() => handleProblemSelect(problem)}
              >
                <div className="problem-icon">
                  {problemIcons[problem.type] || problemIcons.other}
                </div>
                <div className="problem-info">
                  <h4>{problem.description}</h4>
                  <span className="problem-type">{problem.type}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="custom-problem-btn"
            onClick={handleCustomProblemClick}
          >
            + Report Custom Problem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="problem-report-form">
          {selectedProblem && (
            <div className="selected-problem">
              <div className="problem-icon large">
                {problemIcons[selectedProblem.type] || problemIcons.other}
              </div>
              <h3>{selectedProblem.description}</h3>
              <p className="problem-type">{selectedProblem.type}</p>
            </div>
          )}
          
          {showCustomForm && (
            <div className="form-group">
              <label>Describe your problem:</label>
              <textarea
                placeholder="Please describe the issue in detail..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                required
                rows={5}
              />
            </div>
          )}
          
          {selectedProblem && (
            <div className="form-group">
              <label>Additional details (optional):</label>
              <textarea
                placeholder="Add any additional information..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Report Problem"}
            </button>
            <button 
              type="button" 
              onClick={resetForm}
              className="cancel-button"
              disabled={loading}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProblemForm;