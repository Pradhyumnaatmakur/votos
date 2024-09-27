import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  const categories = [
    "korean-movies",
    "chinese-movies",
    "japanese-movies",
    "thai-movies",
    "korean-dramas",
    "chinese-dramas",
    "japanese-dramas",
    "thai-dramas",
  ];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/${category}`}
              className="bg-black text-white p-4 rounded-lg text-center hover:bg-gray-800 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold">
                {category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
