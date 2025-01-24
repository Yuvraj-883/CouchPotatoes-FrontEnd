import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const res = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/movie/search?q=${query}`);
        const data = await res.json();

        if (data && Array.isArray(data.result)) {
          onSearch(data.result); // Pass the fetched movies to the parent component
        } else {
          onSearch([]); // Send an empty array if no results are found
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        onSearch([]); // Clear movies if there's an error
      }
    }
  };

  return (
    <div className="search-bar-container flex flex-col items-center p-4">
      <div className="flex items-center w-full max-w-lg bg-white rounded-lg shadow-md">
        <input
          type="text"
          className="flex-grow p-3 text-gray-700 border-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
