import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./ProblemList.css"; // We'll create this CSS file

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const chefId = searchParams.get("chefId") || "unknown";

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://qhys42-3001.csb.app/problems?chefId=${chefId}`);
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      alert("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const markAsSolved = async (problemId) => {
    try {
      await axios.put(`https://qhys42-3001.csb.app/problems/${problemId}`, {
        status: "solved"
      });
      fetchProblems(); // Refresh the list
    } catch (error) {
      console.error("Error updating problem:", error);
      alert("Failed to mark problem as solved");
    }
  };

  const deleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await axios.delete(`https://qhys42-3001.csb.app/problems/${problemId}`);
        fetchProblems(); // Refresh the list
      } catch (error) {
        console.error("Error deleting problem:", error);
        alert("Failed to delete problem");
      }
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [chefId]);

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
    <div className="problem-list-container">
      <h2>Reported Problems</h2>

      {loading ? (
        <div className="loading-spinner">Loading problems...</div>
      ) : problems.length === 0 ? (
        <p className="no-problems">No problems found.</p>
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
                  <td className="problem-type">
                    {problem.type}
                  </td>
                  <td className="problem-description">
                    {problem.description}
                  </td>
                  <td className={`problem-status ${getStatusColor(problem.status)}`}>
                    {problem.status}
                  </td>
                  <td className="problem-actions">
                    {problem.status !== "solved" && (
                      <button 
                        onClick={() => markAsSolved(problem.id)}
                        className="solve-btn"
                      >
                        Mark as Solved
                      </button>
                    )}
                    <button 
                      onClick={() => deleteProblem(problem.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
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

export default ProblemList;
