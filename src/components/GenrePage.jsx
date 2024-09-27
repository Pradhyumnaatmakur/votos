import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { loadData } from "../utils/dataLoader";
import { getCategoryName, generateSlug, isMoveOrDrama } from "../utils/utils";

function GenrePage() {
  const { category, genre } = useParams();
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await loadData(category);
      const filteredContent = data.filter(
        (item) =>
          item.genres &&
          item.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
      );
      setContent(filteredContent);
    };
    fetchContent();
  }, [category, genre]);

  const categoryName = getCategoryName(category);
  const contentType = isMoveOrDrama(category);

  const capitalizeWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const formatTitle = () => {
    const nationality = categoryName.split(" ")[0];
    const capitalizedGenre = capitalizeWord(genre);
    const contentTypeCapitalized =
      contentType === "movie" ? "Movies" : "Dramas";
    return `${nationality} ${capitalizedGenre} ${contentTypeCapitalized}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center flex-grow">
            {formatTitle()}
          </h1>
          <span className="text-lg">
            {content.length} {contentType === "movie" ? "movies" : "dramas"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {content.map((item) => (
            <Link
              to={`/${category}/${generateSlug(item)}`}
              key={item.title}
              className="block"
            >
              <div className="bg-white border border-black rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="relative pb-[150%]">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/300x450"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover lazy"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-1">
                    {item.title} ({item.year})
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenrePage;
