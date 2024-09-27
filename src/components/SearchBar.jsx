import React, { useState, useEffect } from "react";
import { loadAllData } from "../utils/dataLoader";

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      const data = await loadAllData();
      setAllData(data);
    };
    fetchAllData();
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length > 2) {
      const searchResults = Object.entries(allData).flatMap(
        ([category, items]) =>
          items
            .filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => ({ ...item, category }))
      );
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for titles..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
          {results.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setQuery("");
                setResults([]);
              }}
            >
              {item.title} ({item.year}) - {item.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
