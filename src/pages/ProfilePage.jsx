import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import CommentSystem from "../components/CommentSystem";
import { loadData } from "../utils/dataLoader";
import { generateSlug, getCategoryName } from "../utils/utils";

function ProfilePage() {
  const { category, title } = useParams();
  const [content, setContent] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchContentData = async () => {
      const data = await loadData(category);
      const foundContent = data.find((item) => generateSlug(item) === title);
      setContent(foundContent);
    };

    fetchContentData();
  }, [category, title]);

  if (!content) return <div className="text-center py-8">Loading...</div>;

  const categoryName = getCategoryName(category);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-black rounded-lg overflow-hidden shadow-lg w-full max-w-5xl mx-auto flex">
          {/* Image container */}
          <div className="w-2/5 relative" style={{ aspectRatio: "2/3" }}>
            <img
              src={content.imageUrl || "https://via.placeholder.com/300x450"}
              alt={content.title}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-opacity duration-300"></div>
          </div>

          {/* Details container */}
          <div className="w-3/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-center">
              {content.title} ({content.year})
            </h1>
            <Link
              to={`/${category}`}
              className="text-base sm:text-lg lg:text-xl mb-4 text-center hover:underline"
            >
              {categoryName}
            </Link>
            <p className="mb-2 text-sm sm:text-base text-center">
              <span className="font-bold">Genre:</span>{" "}
              {content.genres
                ? content.genres.map((genre, index) => (
                    <React.Fragment key={genre}>
                      <Link
                        to={`/${category}/genre/${genre.toLowerCase()}`}
                        className="hover:underline"
                      >
                        {genre}
                      </Link>
                      {index < content.genres.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))
                : "N/A"}
            </p>
            <p className="mb-2 text-sm sm:text-base text-center">
              <span className="font-bold">Duration:</span>{" "}
              {content.duration || "N/A"}
            </p>
            <p className="mb-4 text-sm sm:text-base text-center">
              <span className="font-bold">Release Date:</span>{" "}
              {content.releaseDate || "N/A"}
            </p>
            <Link
              to={`/${category}/${title}/recommendations`}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded inline-block text-sm sm:text-base"
            >
              Recommendations
            </Link>
          </div>
        </div>

        {/* Comment System */}
        {content && (
          <CommentSystem
            contentId={generateSlug(content)}
            category={category}
          />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
