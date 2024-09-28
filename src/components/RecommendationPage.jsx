import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { getRecommendations, addRecommendation } from "../utils/utils";

function RecommendationPage() {
  const { category, title } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRecommendation, setNewRecommendation] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, [category, title]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getRecommendations(category, title);
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    if (!newRecommendation.trim()) return;

    try {
      const success = await addRecommendation(category, title, {
        title: newRecommendation,
      });
      if (success) {
        setNewRecommendation("");
        fetchRecommendations();
      } else {
        setError("Failed to add recommendation. Please try again.");
      }
    } catch (error) {
      console.error("Error adding recommendation:", error);
      setError("Failed to add recommendation. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <h1>Recommendations for {decodeURIComponent(title)}</h1>
      {recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec.title}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddRecommendation}>
        <input
          type="text"
          value={newRecommendation}
          onChange={(e) => setNewRecommendation(e.target.value)}
          placeholder="Enter a new recommendation"
        />
        <button type="submit">Add Recommendation</button>
      </form>
    </div>
  );
}

export default RecommendationPage;
