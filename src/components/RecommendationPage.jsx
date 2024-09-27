import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { loadData, loadAllData } from "../utils/dataLoader";
import { generateSlug, getCategoryName, isMoveOrDrama } from "../utils/utils";
import SearchBar from "../components/SearchBar";
import AddRecommendation from "../components/AddRecommendation";

function RecommendationPage() {
  const { category, title } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [similarContent, setSimilarContent] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadData(category);
        const foundContent = data.find((item) => generateSlug(item) === title);
        if (!foundContent) {
          throw new Error("Content not found");
        }
        setContent(foundContent);

        const response = await fetch(
          `/api/recommendations/${category}/${title}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recommendationsData = await response.json();
        setRecommendations(recommendationsData);

        // Find similar content based on genres
        const allData = await loadAllData();
        const similar = allData[category]
          .filter(
            (item) =>
              item.title !== foundContent.title &&
              item.genres &&
              foundContent.genres &&
              item.genres.some((g) => foundContent.genres.includes(g))
          )
          .slice(0, 15);
        setSimilarContent(similar);

        setImageLoaded(
          Object.fromEntries(
            [...recommendationsData, ...similar].map((rec) => [
              rec.title,
              false,
            ])
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, title]);

  const handleAddRecommendation = async () => {
    if (!selectedRecommendation) return false;

    try {
      const isDuplicate = recommendations.some(
        (rec) =>
          rec.title === selectedRecommendation.title &&
          rec.year === selectedRecommendation.year
      );

      if (isDuplicate) {
        setMessage("Recommendation already exists on this page.");
        return false;
      }

      const response = await fetch(
        `/api/recommendations/${category}/${title}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedRecommendation),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add recommendation");
      }

      const newRecommendation = await response.json();
      setRecommendations([...recommendations, newRecommendation]);
      setMessage("Recommendation added successfully!");
      setSelectedRecommendation(null);
      return true;
    } catch (error) {
      console.error("Error adding recommendation:", error);
      setMessage("Failed to add recommendation. Please try again.");
      return false;
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!content)
    return <div className="text-center py-8">Content not found</div>;

  const categoryName = getCategoryName(category);
  const contentType = isMoveOrDrama(category);

  const RecommendationCard = ({ rec, index }) => (
    <div
      key={index}
      className="bg-white border border-black rounded-lg overflow-hidden shadow-lg w-full max-w-5xl mx-auto flex"
    >
      <div className="w-2/5 relative" style={{ aspectRatio: "2/3" }}>
        <img
          src={rec.imageUrl || "https://via.placeholder.com/300x450"}
          alt={rec.title}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded[rec.title] ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() =>
            setImageLoaded((prev) => ({ ...prev, [rec.title]: true }))
          }
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-opacity duration-300"></div>
      </div>
      <div className="w-3/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
        <Link
          to={`/${category}/${generateSlug(rec)}`}
          className="hover:underline"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-center">
            {rec.title} ({rec.year})
          </h2>
        </Link>
        <Link to={`/${category}`} className="hover:underline">
          <p className="text-base sm:text-lg lg:text-xl mb-4 text-center">
            {getCategoryName(category)}
          </p>
        </Link>
        <p className="mb-2 text-sm sm:text-base text-center">
          <span className="font-bold">Genre:</span>{" "}
          {rec.genres
            ? rec.genres.map((genre, index) => (
                <React.Fragment key={genre}>
                  <Link
                    to={`/${category}/genre/${genre.toLowerCase()}`}
                    className="hover:underline"
                  >
                    {genre}
                  </Link>
                  {index < rec.genres.length - 1 ? ", " : ""}
                </React.Fragment>
              ))
            : "N/A"}
        </p>
        <p className="mb-4 text-sm sm:text-base text-center">
          <span className="font-bold">Duration:</span> {rec.duration || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-center">
          {content.title} ({content.year}) {categoryName} Recommendations
        </h1>
        {recommendations.length === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              No Recommendations Found
            </h2>
            <h3 className="text-xl font-bold mb-4 text-center">
              Add Recommendations
            </h3>
          </>
        )}
        <div className="mb-8">
          <SearchBar onSelect={setSelectedRecommendation} />
          {selectedRecommendation && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Selected Recommendation:</h2>
              <p>
                {selectedRecommendation.title} ({selectedRecommendation.year})
              </p>
              <AddRecommendation onAdd={handleAddRecommendation} />
            </div>
          )}
          {message && (
            <div className="mt-4 p-2 bg-blue-100 text-blue-700 rounded">
              {message}
            </div>
          )}
        </div>
        {recommendations.length > 0 ? (
          <div className="space-y-8">
            {recommendations.map((rec, index) => (
              <RecommendationCard rec={rec} index={index} key={index} />
            ))}
          </div>
        ) : (
          similarContent.length > 0 && (
            <>
              <h4 className="text-lg font-bold mb-4 text-center">
                Try Out These
              </h4>
              <div className="space-y-8">
                {similarContent.map((rec, index) => (
                  <RecommendationCard rec={rec} index={index} key={index} />
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default RecommendationPage;
