import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./prprob.css"; // Assuming you have a CSS file for styling
const PredefinedProblems = () => {
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    title: "",
    type: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPredefinedProblems();
  }, []);

  const fetchPredefinedProblems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/problems/predefined");
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching predefined problems:", error);
      alert("Failed to fetch predefined problems");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProblem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3001/problems/predefined", {
        title: newProblem.title,
        type: newProblem.type,
        description: newProblem.description || newProblem.title // Fallback to title if description empty
      });
      alert("Predefined problem added successfully!");
      setNewProblem({ title: "", type: "", description: "" });
      fetchPredefinedProblems();
    } catch (error) {
      console.error("Error adding predefined problem:", error);
      alert(error.response?.data?.error || "Failed to add predefined problem");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this predefined problem?")) {
      try {
        await axios.delete(`http://localhost:3001/problems/predefined/${id}`);
        alert("Predefined problem deleted successfully!");
        fetchPredefinedProblems();
      } catch (error) {
        console.error("Error deleting predefined problem:", error);
        alert("Failed to delete predefined problem");
      }
    }
  };

  return (
    <div className="predefined-container">
      
      <div className="add-problem-form">
        <h2>Add New Predefined Problem</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={newProblem.title}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select
              name="type"
              value={newProblem.type}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">Select a type</option>
              <option value="safety">Safety</option>
              <option value="equipment">Equipment</option>
              <option value="payment">Payment</option>
              <option value="facility">Facility</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description (optional):</label>
            <textarea
              name="description"
              value={newProblem.description}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Problem"}
          </button>
        </form>
      </div>

            <div className="problems-list">
        <h2>Existing Predefined Problems</h2>
        {loading ? (
          <p>Loading predefined problems...</p>
        ) : problems.length === 0 ? (
          <p>No predefined problems found</p>
        ) : (
          <div className="table-container"> {/* 👈 Add this wrapper */}
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr key={problem.id}>
                    <td>{problem.title}</td>
                    <td>{problem.description}</td>
                    <td>{problem.type}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(problem.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> // 👈 Close the wrapper
        )}
      </div>


      <button onClick={() => navigate("/")} disabled={loading}>
        Back to Main Page
      </button>
    </div>
  );
};

export default PredefinedProblems;