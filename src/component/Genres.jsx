import React, { useEffect, useState } from "react";

const GenreList = ({ onGenreSelect, selectedGenres }) => {
  const apiUrl = 'https://couch-potatoes-backend-smoky.vercel.app/movie/genres';
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(apiUrl);
        const res = await response.json();
        setGenres(res || []);
      } catch (err) {
        setError("Failed to fetch genres.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genre) => {
    onGenreSelect(genre); // Notify the parent component of the selected genre
  };

  if (loading) {
    return <div>Loading genres...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-2 mb-2">
      <ul className="flex flex-row bg-gray-100 overflow-x-auto whitespace-nowrap py-2 rounded-md mb-4">
        {genres.map((genre, index) => (
          <li
            key={index}
            className={`text-gray-700 px-3 py-1 h-8 rounded-l-full rounded-r-full mx-2 cursor-pointer hover:bg-blue-500 hover:text-white
              ${selectedGenres?.includes(genre) ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => handleGenreClick(genre)} // Call onGenreSelect when a genre is clicked
          >
            {genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
