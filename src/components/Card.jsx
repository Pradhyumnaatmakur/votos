import { useState } from "react";
import { isMoveOrDrama } from "../utils/utils";

function Card({
  content,
  category,
  showRecommendation = false,
  onRecommendation,
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (!content) {
    return <div>Loading...</div>;
  }

  const contentType = isMoveOrDrama(category);

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pb-[150%]">
        <img
          src={content.imageUrl || "https://via.placeholder.com/300x450"}
          alt={content.title || "Content"}
          className={`absolute h-full w-full object-cover ${
            isHovered ? "scale-110" : ""
          } transition-all duration-300`}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">
          {content.title || "Unknown Title"}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          {contentType === "movie" ? "Movie" : "Drama"}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          Genres:{" "}
          {content.genres && content.genres.length > 0
            ? content.genres.join(", ")
            : "N/A"}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          Duration: {content.duration || "N/A"}
        </p>
        {showRecommendation && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
            onClick={onRecommendation}
          >
            Recommendations
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
