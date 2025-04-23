import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const TechnicienProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const technicienId = searchParams.get("technicienId") || "unknown";

  const fetchAssignedProblems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/problems?assignedTechnician=${technicienId}`
      );
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching assigned problems:", error);
      alert("Failed to fetch assigned problems");
    } finally {
      setLoading(false);
    }
  };

  const acceptProblem = async (problemId) => {
    try {
      await axios.put(`http://localhost:3001/problems/${problemId}`, {
        status: "progressing"
      });
      fetchAssignedProblems(); // Refresh the list
    } catch (error) {
      console.error("Error accepting problem:", error);
      alert("Failed to accept problem");
    }
  };

  const markAsSolved = async (problemId) => {
    try {
      await axios.put(`http://localhost:3001/problems/${problemId}`, {
        status: "solved"
      });
      fetchAssignedProblems(); // Refresh the list
    } catch (error) {
      console.error("Error marking problem as solved:", error);
      alert("Failed to mark problem as solved");
    }
  };

  useEffect(() => {
    fetchAssignedProblems();
  }, [technicienId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "status-waiting";
      case "progressing":
        return "status-progress";
      case "solved":
        return "status-solved";
      default:
        return "";
    }
  };

  return (
    <div className="technicien-problem-list-container">
      <h2>Assigned Problems</h2>

      {loading ? (
        <div className="loading-spinner">Loading problems...</div>
      ) : problems.length === 0 ? (
        <p className="no-problems">No problems assigned to you.</p>
      ) : (
        <div className="problems-table-container">
          <table className="problems-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="problem-type">{problem.type}</td>
                  <td className="problem-description">{problem.description}</td>
                  <td className={`problem-status ${getStatusColor(problem.status)}`}>
                    {problem.status}
                  </td>
                  <td className="problem-actions">
                    {problem.status === "waiting" && (
                      <button
                        onClick={() => acceptProblem(problem.id)}
                        className="accept-btn"
                      >
                        Accept
                      </button>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TechnicienProblemList;