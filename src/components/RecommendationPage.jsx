import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";

function RecommendationPage() {
  const { category, title } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/recommendations/${category}/${title}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched recommendations:", data);
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category, title]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <h1>Recommendations for {title}</h1>
      {recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendationPage;
